import { Component, Inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationMessageKeys } from "@common/src/lib/constants/notification.message.keys";
import { BaseComponent, ConfigService, IConfiguration, NavigationService, NotificationService, Order, OrderService, OrderStatus, Product, RouteKeys, WINDOW } from "@common/src/public-api";

@Component({
    selector: 'ui-order-detail-component',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent extends BaseComponent {
    private _configuration: IConfiguration;
    private _trackableOrderStates: Array<string> = [
        'PaymentInProgress',
        'Failed',
        'Open',
        'Picking',
        'Dispatch'
    ];  

    @Input() order: Order;
    @Input() metadata: any;
    @Input() template: 'LIST' | 'DETAIL' = 'LIST';
    @Input() slot: any;

    currentState: { status: OrderStatus, statusDate: Date };
    returnedState: { status: OrderStatus, statusDate: Date };
    deliveredItems: Array<Product>;
    returnedItems: Array<Product>;
    currencyCode: string;

    constructor (
        router: Router,
        @Inject(WINDOW) window: any,
        configService: ConfigService,
        private orderService: OrderService,
        private navigationService: NavigationService,
        private notificationService: NotificationService,
    ) {
        super(router, window);
        
        this._configuration = configService.getConfiguration();
        this.currencyCode = this._configuration.currencyCode;     
    }

    async ngOnInit(): Promise<void> {
        this.currentState = this.order.statusHistory?.find(s => s.status === (this.order.status === OrderStatus.SemiReturned ? OrderStatus.Delivered : this.order.status));
        this.returnedState = this.order.statusHistory?.find(s => s.status === OrderStatus.SemiReturned);
        this.deliveredItems = this.order.items.filter(i =>(!(!!i.returned)));
        this.returnedItems = this.returnedState ? this.order.items.filter(i =>(!!i.returned)) : null;
    }

    public wrapItem(i: any): any {
        return { item: i };
    }

    public async cancelClicked(): Promise<void> {
        try 
        {
            const result = await this.orderService.cancelOrder(this.order._id).toPromise();           
            this.order.status = result.status;
            this.order.modifiedDate = result.modifiedDate;
        }
        catch(ex) 
        {
            this.notificationService.showMessage(NotificationMessageKeys.OrderCancellationError);
        }
    }

    public get isProductSupportEnabled(): boolean {
        return this._configuration.productSupport;
    }

    public get isReturnItemsEnabled(): boolean {
        return this._configuration.returnItems;
    }

    public get isReviewProductEnabled(): boolean {
        return this._configuration.showReview;
    }

    public get isTrackable(): boolean {
        return this._trackableOrderStates.includes(this.order.status);
    }

    public get showRedirectToPayment(): boolean {       
       return this.order.status === OrderStatus.Failed;    
    }

    public get hideButtons(): boolean {
        return this.order.status === OrderStatus.Cancelled;
    }

    public async onItemClick(item: any): Promise<void> {        
    }

    public async onWriteProductReview(): Promise<void> {
        let url = '';
        let currentUrl = this.template === 'LIST' ? RouteKeys.AccountOrders : `/account/order/${this.order._id}`;

        if (Array.isArray(this.order.items) && this.order.items.length === 1) {
            url = `/review/product/${this.order.items[0]._id}/order/${this.order._id}`;
        } else {
            url = `/reviews/order/${this.order._id}`;
        }
        await this.navigationService.navigateForUrl(url, currentUrl, this.isMobile);
    }

    public async onGetProductSupport(): Promise<void> {        
    }

    public async onReturnItems(): Promise<void> {        
    }

    public async onTrackOrder(): Promise<void> {        
    }

    public imageUrl(item: any): string {
        if (item && Array.isArray(item.images)){
            const image = item.images.find(i => Number(i.size) === 0);

            if (image) {
                return image.src;
            }
        }
        return '';
    } 
}
