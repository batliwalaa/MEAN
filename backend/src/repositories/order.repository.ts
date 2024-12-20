import { Model, Types } from 'mongoose';
import { Injectable } from '../core/decorators';
import { Order, OrderSearchMap, OrderStatus, Product, Result } from '../models';
import { FileType } from '../models/enums/file-type';
import { OrderPaymentStatus } from '../models/enums/order-payment-status';
import OrderCollection from './collections/order.collection';
import { OrderModel } from './models/order.model';

@Injectable()
export class OrderRepository {
    private orderCollection: Model<OrderModel, any>;
    private pageSize: number;

    constructor (
        // @ts-ignore
        environment: Environment
    ) {
        this.pageSize = environment.pageSize;
        if (!this.pageSize) {
            this.pageSize = 25;
        }

        this.orderCollection = OrderCollection();
    }  

    public async save(order: Order): Promise<Order> {
        const options = await this.orderCollection.collection.insertOne(order, { bypassDocumentValidation: true });

        order._id = options.insertedId.toString();

        return order;
    }
    
    public async saveInvoiceState(
        orderID: string,
        fileName: string,
        invoiceNumber: string,
        invoiceDate: Date

    ): Promise<void> {
        await this.orderCollection.collection.updateOne(
            { _id: Types.ObjectId(orderID) },
            { $set: { 
                invoice: fileName,
                selectedForInvoicing: false,
                invoiceNumber,
                invoiceDate
            } },
            { bypassDocumentValidation: true }
        );
    }

    public async saveCreditNoteState(
        orderID: string,
        fileName: string,
        creditNoteNumber: string,
        creditNoteDate: Date

    ): Promise<void> {
        await this.orderCollection.collection.updateOne(
            { _id: Types.ObjectId(orderID) },
            { $set: { 
                creditNote: fileName,
                selectedForCreditNote: false,
                creditNoteNumber,
                creditNoteDate
            } },
            { bypassDocumentValidation: true }
        );
    }

    public async resetDocumentGenerationFlag(orderID: string, contextType: 'Invoice' | 'CreditNote'): Promise<void> {
        const flag: any = contextType === 'Invoice' ? { 
            selectedForCreditNote: false,
            creditNote: null,
            creditNoteNumber: null,
            creditNoteDate: null
        } : { 
            invoice: null,
            selectedForInvoicing: false,
            invoiceNumber: null,
            invoiceDate: null
        };

        await this.orderCollection.collection.updateOne(
            { _id: Types.ObjectId(orderID) },
            { $set: flag },
            { bypassDocumentValidation: true }
        );
    }

    public async setStatus(
        orderID: string,
        orderStatus: OrderStatus,
        userID: string,
        paymentStatus?: OrderPaymentStatus,
        paymentResponseID?: string
    ): Promise<any> {
        const now = new Date();
        let changes = {};
        changes = { 
                    status: orderStatus, 
                    modifiedDate: now, 
                    modifiedBy: userID                   
                };
      
        if (!!paymentStatus) {
            changes = { ...changes, orderPaymentStatus: paymentStatus };
        }

        if (!!paymentResponseID) {
            changes = { ...changes, paymentID: paymentResponseID };
        }

        await this.orderCollection.collection.updateOne(
            { _id: Types.ObjectId(orderID) },
            { 
                $push:   { statusHistory: { status: orderStatus, statusDate: now } },
                $set: changes 
            },
           
            { bypassDocumentValidation: true});

        const result = await this.getByOrderID(userID, orderID);
        return { status: result.status, modifiedDate: result.modifiedDate }
    }

    public async getByOrderID(userID: string, orderID: string): Promise<Order> {
        const r = await this.orderCollection.findOne({ userID: userID, _id: Types.ObjectId(orderID) }).exec();

        return r && r._doc ? r._doc : r
    }

    public async getDocumentFilename(       
        orderID: string,
        fileType: FileType       
    ): Promise<string> {
        const projection = fileType === FileType.Invoice ? { invoice: 1 } : { creditNote: 1};
        let r: any = await this.orderCollection.findOne( { _id: Types.ObjectId(orderID) }, projection).exec();

        if (r) {
            r = r && r._doc ? r._doc : r;
            return r.invoice ?? r.creditNote;
        }
        return null;
    }

    public async search(
        userID: string,
        pageNumber: number,
        searchMap: OrderSearchMap,
        projection: any = {
            _id: 1,
            orderNumber: 1,
            userID: 1,
            addressID: 1,
            items: 1,
            dateCreated: 1,
            status: 1,
            amount: 1,
            invoice: 1,
            statusHistory: 1,
            orderPaymentStatus: 1,
            slotId: 1,
            slotType: 1,
            modifiedDate: 1,
            invoiceNumber: 1,
            invoiceDate: 1,
            creditNote: 1
        }
    ): Promise<Result<Order>> {
        const skip = (pageNumber - 1) * Number(this.pageSize);
        const queryObject = this.getQueryObject(userID, searchMap);
        const totalItems: number = 4;
        
        if (!queryObject) {
             return new Result<Order>([], 0);
        }

        const recordCount = await this.getCount(queryObject);
        const aggregation: Array<any> = [];
        
        aggregation.push(queryObject);
        aggregation.push({ $project: projection });
        aggregation.push({ $sort: { dateCreated: -1 } });
        aggregation.push({ $skip: skip });
        aggregation.push({ $limit: Number(this.pageSize)});

        let query = this.orderCollection.aggregate(aggregation);
        const items = await query.exec();

        for( let i = 0; i < items.length; i++) {
            const order: any = items[i];
            if (Array.isArray(order.items)) {
                const ri =  order.items.filter((i: any) =>(!!i.returned)).slice(0, totalItems /2);
                const di = order.items.filter((i: any) =>(!(!!i.returned))).slice(0, totalItems - ri.length);

                order.items = ri.concat(di);                           
            }
        }

        return new Result<Order>(items.map((i: any) => ({ ...i, _id: i._id.toString() })), recordCount);
    }

    public async getOrderProduct(orderID: string, productID: string): Promise<Product> {
        const result = await this.orderCollection.findOne({ _id: Types.ObjectId(orderID) }).exec();
        const products: Array<Product> = result && result._doc ? result._doc.items : result.items;

        return products.find(p => p._id === productID);
    }

    public async getOrdersReadyForInvoicing(): Promise<Array<{userID: string, orderID: string}>> {
        const r = await this.orderCollection.find(
            {   $and: [
                    { $or: [ { invoice: {$exists: false } }, { invoice: { $eq: '' } }, { invoice: { $eq: null } } ] },
                    { $or: [ { selectedForInvoicing: { $exists: false } }, { selectedForInvoicing: false } ] },
                    { status: { $nin: [ 'PaymentInProgress', 'Failed', 'Closed' ] } },
                    { $and : [ { orderNumber: { $exists: true } }, { orderNumber: { $ne: '' } }, { orderNumber: { $ne: null} } ] },
                    { $or: [ { flagged: { $exists: false } }, { flagged: false } ] }
                ]
            },
            { _id: 1, userID: 1 }
        );

        return r.map((o: any) => (o && o._doc ? o._doc : o)).map((o: any) => ({ orderID: o._id.toString(), userID: o.userID }));
    }

    public async setSelectedForInvoice(items: Array<string>): Promise<void> {
        await this.orderCollection.collection.updateMany(
            { _id: { $in: items.map(i => Types.ObjectId(i)) } },
            { $set: { selectedForInvoicing: true } }
        );
    }

    public async getOrdersForCreditNote()
        : Promise<Array<{ orderID: string, userID: string }>> {
        const r = await this.orderCollection.find(
            {   $and: [
                    { $or: [ { creditNote: {$exists: false } }, { creditNote: { $eq: '' } }, { creditNote: { $eq: null } } ] },
                    { $or: [ { selectedForCreditNote: { $exists: false } }, { selectedForCreditNote: false } ] },
                    { status: { $in: [ 'SemiReturned', 'Returned' ] } },
                    { $and: [ { flagged: { $exists: true } }, { flagged: false } ] }
                ]
            },
            { _id: 1, userID: 1 }
        );

        return r.map((o: any) => (o && o._doc ? o._doc : o))
                .map((o: any) => ({ orderID: o._id.toString(), userID: o.userID }));
    }

    public async setSelectedForCreditNote(items: Array<string>): Promise<void> {
        await this.orderCollection.collection.updateMany(
            { _id: { $in: items.map(i => Types.ObjectId(i)) } },
            { $set: { selectedForCreditNote: true } }
        );
    }
    
    private getQueryObject(userID?: string, search?: OrderSearchMap): any {
        const $andArray: any = [];
        
        if (userID) {
            $andArray.push({ userID });
        }

        if (search.from) {
            $andArray.push({ dateCreated: { '$gte': search.from } });
        }
        
        if (search.to) {
            $andArray.push({ dateCreated: { '$lte': search.to } });
        }

        if (Array.isArray(search.query) && search.query.length > 0) {
            for (let i = 0; i < search.query.length; i++) {
                const kvp = search.query[i];
                let q: any = {}
                q[kvp.Key] = RegExp(`^.*${kvp.Value}.*$`, 'im');
                $andArray.push(q);
            }
        }
        return $andArray.length === 0 ? null : { $match: { $and: $andArray }};
    }

    private async getCount(query: any): Promise<number> {
        const aggregation: Array<any> = [];

        aggregation.push(query);
        aggregation.push({ $count: 'records' });

        const result = await this.orderCollection.aggregate(aggregation).exec();

        return Array.isArray(result) && result.length === 1 ? result[0].records : 0;
    }
}
