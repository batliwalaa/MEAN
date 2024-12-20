import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import {
    AddressService,
    AuthService,
    BaseComponent,
    ConfigService,
    DataStoreService,
    MenuStateService,
    NavigationService,
    RouteKeys,
    WINDOW
} from "@common/src/public-api";

@Component({
    selector: 'ui-order-header-component',
    templateUrl: './order-header.component.html',
    styleUrls: ['./order-header.component.scss']
})
export class OrderHeaderComponent extends BaseComponent {
    @Input() order: any;
    @Input() slot: any;
    @Input() metadata: any;
    @Input() template: 'LIST' | 'DETAIL' = 'LIST';
    
    @Output() showDetail: EventEmitter<boolean> = new EventEmitter<boolean>();

    deliveryAddress: any;
    showDeliveryAddress: boolean = false;
    showInvoiceOptions: boolean = false;
    show: boolean = false;
    currencyCode: string;

    constructor (
        router: Router,
        menuStateService: MenuStateService,
        dataStoreService: DataStoreService,
        @Inject(WINDOW) window: any,
        private authService: AuthService,
        private addressService: AddressService,
        private navigationService: NavigationService,
        configService: ConfigService
    ) {
        super(router, window, menuStateService, dataStoreService);
        this.currencyCode = configService.getConfiguration().currencyCode;
    }

    public get showDocuments(): boolean {
        return this.order.invoice;
    }

    public get showCreditNote(): boolean {
        return this.order.creditNote;
    }

    public get fullName(): string {
        return `${this.authService.user.firstName} ${this.authService.user.lastName}`;
    }

    public get paymentMode(): string {
        return this.order && this.order.payment.mode;
    }

    public get bankCode(): string {
        return this.order && this.order.payment.bankCode.toLowerCase();
    }

    public get paymentInfo(): string {
        if (this.order) {
            const payment = this.order.payment;

            switch (payment.mode) {
                case 'CC':
                    return `**** ${payment.cardNum.slice(payment.cardNum.length - 4)}`;
                default:
                    return '';
            }
        }
        
        return '';
    }

    public async onDeliveryClick(): Promise<void> {
        this.showDeliveryAddress = !this.showDeliveryAddress;

        if (this.showDeliveryAddress && !this.deliveryAddress) {
            try {
                this.deliveryAddress = await this.addressService.getById(this.order.addressID);
            } catch (e) {
            }
        }        
    }

    public async onShowDetailClick(): Promise<void> {
        this.show = !this.show;
        this.showInvoiceOptions = false;
        this.showDetail.emit(this.show);
    }

    public async onDetailsClick(): Promise<void> {
        await this.navigationService.navigateForUrl(`${RouteKeys.AccountOrderDetail}${this.order._id}`, this.currentPage, this.isMobile);
    }
}
