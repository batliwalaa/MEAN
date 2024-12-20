import { IHandler } from '../../core/mediator/handler';
import { GetOrderByIdRequest, GetOrderByIdResponse } from '..';
import { Injectable } from '../../core/decorators';
import { OrderService, DeliverySlotService, AddressService, PaymentService, UserService } from '../../services';

@Injectable()
export class GetOrderByIdHandler implements IHandler<GetOrderByIdRequest, GetOrderByIdResponse> {
    constructor(
        private orderService: OrderService,
        private deliverySlotService: DeliverySlotService,
        private addressService: AddressService,
        private paymentService: PaymentService,
        private userService: UserService
    ){}

    public async handle(request: GetOrderByIdRequest): Promise<GetOrderByIdResponse> {
        const response: GetOrderByIdResponse = {} ;
        
        const order = await this.orderService.getByOrderID(request.userId, request.orderId);
        const address = await this.addressService.get(order.addressID);
        const payment = await this.paymentService.get(order.paymentID);
        const user = await this.userService.getUserById(order.userID);

        if (request.includeSlot){
            response.slot = await this.deliverySlotService.findById(order.slotId, order.slotType);
        }    
        
        response.order = {
            dateCreated: order.dateCreated,
            orderNumber: order.orderNumber,
            amount: order.amount,
            status: order.status,
            statusHistory: order.statusHistory,
            orderPaymentStatus: order.orderPaymentStatus,
            invoice: order.invoice,
            items: order.items,
            _id: order._id,
            userID: order.userID,
            slotID: order.slotId,
            slotType: order.slotType,
            modifiedDate: order.modifiedDate,
            address,
            payment: {
                mode: payment.mode,
                bankCode: payment.bankcode,
                cardNum: payment.cardnum
            },
            fullName: `${user.firstName} ${user.lastName}`
        }

        return response;
    }
}