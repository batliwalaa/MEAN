import { OrderService } from "../..";
import { Injectable } from "../../../core/decorators";
import { DocumentGenerationContext } from '..';
import { OrderItem } from "../../../models/order-item";
import { DocumentGenerationContextRepository } from '../../../repositories';
import { BaseTask } from '../../../core/tasks';
import { DocumentGenerationContextModel } from "../../../repositories/models/document-generation-context.model";
import { DocumentItem, Order, OrderStatus } from "../../../models";

@Injectable()
export class GetOrderInformationTask extends BaseTask<DocumentGenerationContext, DocumentGenerationContextModel> {    
    constructor(
        DocumentGenerationContextRepository: DocumentGenerationContextRepository,
        private orderService: OrderService
    ) {
        super(DocumentGenerationContextRepository);
    }

    public isValid(state: DocumentGenerationContext): boolean { 
        if (state.templateData && state.templateData.orderNumber) {
            return false;
        }

        return true;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        const order: Order = await this.orderService.getByOrderID(state.userID, state.orderID);
        
        state.continue = !!order;

        if (order && 
                (
                    state.contextType === 'Invoice' || 
                    (
                        state.contextType === 'CreditNote' && 
                        [OrderStatus.SemiReturned, OrderStatus.Returned].includes(order.status)
                    )
                )
        ) {
            state.addressID = order.addressID.toString() ?? '';
            state.sellerID = order.sellerID;
            state.templateData = {
                date: new Date(),
                orderAmount: order.amount,
                totalDiscountAmount: order.totalDiscountAmount,
                orderDate: order.dateCreated,
                orderNumber: order.orderNumber,
                orderPaymentStatus: order.orderPaymentStatus,
                invoiceNumber: order.invoiceNumber,
                invoiceDate: order.invoiceDate,
                status: order.status,
                items: order.items.filter(i => (state.contextType === 'Invoice' || i.returned === true))
                                  .map((i: OrderItem): DocumentItem => ({ 
                                        type: i.type,
                                        subType: i.subType,
                                        brand: i.brand,
                                        description: i.title,
                                        quantity: i.quantity,
                                        price: i.pricing.retail,
                                        amount: i.quantity * i.pricing.retail,
                                        returned: i.returned,
                                        returnedQuantity: i.returnedQuantity,
                                        discountAmount: i.discountAmount
                                    }))
            }
        }

        await this.contextRepository.save(state)

        return state;
    }
}
