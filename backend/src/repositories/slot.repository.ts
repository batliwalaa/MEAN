import _ from 'lodash';
import { Document, Model, Types } from 'mongoose';
import { AvailableSlot, OrderSlot, Slot, SlotState } from '../models';

export abstract class SlotRepository<T extends Document, E extends Slot> {
    protected slotCollection: Model<T, any>;

    constructor() {}

    public async getSlots(from: Date, to: Date): Promise<Array<AvailableSlot>> {
        const slots = await this.slotCollection
            .aggregate([
                { $match: { slotState: 'Open', deliveryDate: { $gte: from, $lte: to } } },
                {
                    $group: {
                        _id: {
                            deliveryDate: '$deliveryDate',
                            startTime: '$startTime',
                            endTime: '$endTime',
                        },
                        'COUNT(*)': { $sum: 1 },
                    },
                },
                {
                    $project: {
                        deliveryDate: '$_id.deliveryDate',
                        startTime: '$_id.startTime',
                        endTime: '$_id.endTime',
                        availableSlots: '$COUNT(*)',
                    },
                },
                {
                    $sort: {
                        deliveryDate: 1,
                        startTime: 1,
                    },
                },
            ])
            .exec();

        return slots;
    }

    public async getForIds(
        ids: Array<string>,
        projection: any = {
            _id: 1, 
            deliveryDate: 1,
            startTime: 1,
            endTime: 1
        }
    ) : Promise<Array<OrderSlot>> {

        if(!Array.isArray(ids) || ids.length === 0) return [];
       
        const r: Array<any> = await this.slotCollection.find(
            { _id: { $in: ids.map(i => Types.ObjectId(i)) } }, 
            projection
        )
           
        return <Array<OrderSlot>> r.map(s => s._doc);  
    } 

    public async findById(
       slotId: string,
        projection: any = {
            _id: 1, 
            deliveryDate: 1,
            startTime: 1,
            endTime: 1
        }
    ): Promise<OrderSlot> {
        let r: any = await this.slotCollection.findOne( { _id: Types.ObjectId(slotId) }, projection).exec();

        if (r) {
            r = r && r._doc ? r._doc : r;
            return { ...r, _id: slotId };
        }
        return null;       
    }

    public async find(key: any): Promise<E> {
        let r = await this.slotCollection.findOne(key).exec();

        if (r) {
            r = r && r._doc ? r._doc : r;
            return { ...r, _id: r._id.toString() };
        }
        return null;
    }

    public async reserve(id: string, shoppingCartID: string, userID: string): Promise<E> {
        let reserveStateExpiresIn = new Date(Date.now());
        reserveStateExpiresIn = new Date(reserveStateExpiresIn.setMinutes(reserveStateExpiresIn.getMinutes() + 30));

        const result = await this.slotCollection.collection.updateOne(
            { _id: Types.ObjectId(id) },
            {
                $set: {
                    slotState: SlotState.Reserved,
                    modifiedDate: new Date(),
                    modifiedBy: userID,
                    shoppingCartID,
                    reserveStateExpiresIn: reserveStateExpiresIn.getTime(),
                },
            },
            { bypassDocumentValidation: true }
        );

        if (result.modifiedCount === 1) {
            return await this.slotCollection.findById(Types.ObjectId(id)).exec();
        }

        return null;
    }

    public async clear(shoppingCartID: string, userID: string): Promise<number> {
        const result = await this.slotCollection.collection.updateMany(
            { shoppingCartID, slotState: SlotState.Reserved },
            { $set: { slotState: SlotState.Open, modifiedDate: new Date(), modifiedBy: userID, shoppingCartID: null } }
        );

        return result.modifiedCount;
    }

    public async clearAllExpiredReservedSlots(): Promise<void> {
        const now = Date.now();

        const result = await this.slotCollection.collection.updateMany(
            { slotState: SlotState.Reserved, reserveStateExpiresIn: { $lte: Date.now() } },
            {
                $set: {
                    slotState: SlotState.Open,
                    modifiedDate: new Date(),
                    modifiedBy: 'background-process',
                    shoppingCartID: null,
                    reserveStateExpiresIn: null,
                },
            }
        );
    }
}
