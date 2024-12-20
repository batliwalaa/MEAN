import { Component, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';

import { CheckoutStateService } from '../../../services/checkout-state.service';
import { Address, AvailableSlot, BaseComponent, ConfigService, DataStoreService, HttpStatusCode, RouteKeys, WINDOW } from '@common/src/public-api';
import { PaymentService } from '@checkout/src/lib/services/payment.service';
import { from } from 'rxjs';
import { delay, first } from 'rxjs/operators';

@Component({
    selector: 'ui-checkout-preview-component',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent extends BaseComponent {
    private payuMode: string;
    private usePaymentTestData: boolean;

    @ViewChild('pointsToRedeem') pointsToRedeem: HTMLInputElement;

    deliveryAddress: Address;
    metadata: any;
    items: Array<{title: string, quantity: number, totalPrice: string, price: string, country: string, imageSrc: string}>
    slot: AvailableSlot;
    acceptance: any;
    currencySymbol: string;
    orderSubTotal: string;
    deliveryCharge: string;
    minimumOrderValue: string;
    promotions: string;
    appliedPromotions: Array<any>; //TODO 
    availableLoyaltyPoints: number;
    currentOrderLoyaltyPointsGain: number;
    loyaltyPointsRedeem: number = 0;
    errors: Array<any> = [];
    loyaltyPoints: boolean;

    constructor(
        private checkoutStateService: CheckoutStateService,
        private paymentService: PaymentService,
        private activatedRoute: ActivatedRoute,
        @Inject(WINDOW) window: Window,
        router: Router,
        dataStoreService: DataStoreService,
        configService: ConfigService
    ) {
        super(router, window, null, dataStoreService);
        const configuration = configService.getConfiguration();
        this.currencySymbol = configuration.currencySymbol;
        this.payuMode = configuration.payuMode;
        this.usePaymentTestData =  configuration.usePaymentTestData;
        this.loyaltyPoints = configuration.loyaltyPoints;
    }

    protected async init(): Promise<void> {
        await this.checkoutStateService.setState();

        this.availableLoyaltyPoints = this.loyaltyPoints ? this.activatedRoute.snapshot.data.loyalty.points : 0;
        this.deliveryAddress = this.checkoutStateService.selectedAddress;
        this.metadata = this.activatedRoute.snapshot.data.metadata['Checkout'].preview;
        this.acceptance = this.activatedRoute.snapshot.data.metadata['Checkout'].acceptance;
        this.items = this.checkoutStateService.items;
        this.slot = this.checkoutStateService.selectedSlot;
        this.minimumOrderValue = Number(this.activatedRoute.snapshot.data.deliveryOptions.freeDeliveryMinOrderValue).toFixed(2);
        this.orderSubTotal = this.items.map(i => Number(i.totalPrice)).reduce((acc, item) => acc + item).toFixed(2);
        this.deliveryCharge = this.calculateDeliveryCharge();
        this.promotions = this.calculatePromotionDiscount();
        this.currentOrderLoyaltyPointsGain = Math.floor(Number(this.orderTotal) / 100);
    }

    async onContinueClick(): Promise<void> {
        try {
            const response = await this.paymentService.initiatePayment(
                this.checkoutStateService.selectedAddress._id,
                Number(this.orderTotal), this.loyaltyPointsRedeem, []);

            if (this.payuMode !== 'redirect') {
                const handler = { responseHandler: (BOLT: any) => this.processPaymentResponse(BOLT.response) };
                if (!this.usePaymentTestData) {
                    // @ts-ignore
                    bolt.launch(response, handler);
                } else {
                    this.processPaymentResponse(this.paymentTestData);
                }
            } else {
                if (!this.usePaymentTestData) {
                    this.window.location.href = response.url;
                } else {
                    this.processPaymentResponse(this.paymentTestData);
                }
            }
        } catch(e) {
            if (e.status === HttpStatusCode.BadRequest && e.error.name === 'InvalidRedeemPoints') {
                this.handleInvalidRedeemPoints(e);
            } else {
                this.router.navigateByUrl(RouteKeys.ErrorPayment);
            }
        }
        await Promise.resolve();
    }

    get orderTotal(): string {
        return (Number(this.orderSubTotal) + Number(this.deliveryCharge) - Number(this.promotions) - Number(this.loyaltyPointsRedeem)).toFixed(2);
    }
    
    get hasErrors(): boolean {
        return this.errors.length > 0;
    }

    getPointsToRedeem(): string {
        if (!this.loyaltyPoints) return Number(0).toFixed(2);

        let value = Number(this.loyaltyPointsRedeem);

        if (isNaN(value)) return Number(0).toFixed(2);
        if (value < 0) { 
            value = 0;
            this.loyaltyPointsRedeem = value;
        }
        if (value > this.availableLoyaltyPoints) {
             value = this.availableLoyaltyPoints;
             this.loyaltyPointsRedeem = value;
        }

        return value.toFixed(2)
    }

    protected async destroy(): Promise<void> {
        await this.checkoutStateService.clearState();
    }

    private calculateDeliveryCharge(): string {
        return Number(this.minimumOrderValue) < Number(this.orderSubTotal) ? Number(0).toFixed(2) : Number(80).toFixed(2);
    }

    private calculatePromotionDiscount(): string {
        return Number(0).toFixed(2);
    }

    private get paymentTestData(): any {
        return { "country":"","udf10":"","discount":"0.00","mode":"CC","cardhash":"This field is no longer supported in postback params.","error_Message":"No Error","state":"","bankcode":"VISA","txnid":"5fc2f966db5b3530fa8e62c5","surl":"\"https://localhost/api/v1.0/payment/success","net_amount_debit":"718.1","lastname":"","zipcode":"","phone":"7595473800","productinfo":"Amreet Bazaar","hash":"75df2682552ede255c319cc4f91dfe3085fef702ada35e11692805fb5ac2aec9d37792bfd0326c2ddf7acf64423654b06964dff03877d7f88408157a4c271321","status":"success","firstname":"Anis","city":"","isConsentPayment":"0","error":"E000","addedon":"2020-11-29 07:02:18","udf9":"","udf7":"","udf8":"","encryptedPaymentId":"06C42458D8053DCFB563A79DA137B796","bank_ref_num":"326518227617874","key":"LJRhtlC8","email":"batliwalaa@hotmail.com","amount":"718.10","unmappedstatus":"captured","address2":"","payuMoneyId":"250668230","address1":"","udf5":"BOLT_KIT_NODE_JS","mihpayid":"9084082488","udf6":"","udf3":"","udf4":"","udf1":"","udf2":"","giftCardIssued":"true","field1":"548471327917","cardnum":"401200XXXXXX1112","field7":"AUTHPOSITIVE","field6":"","furl":"\"https://localhost/api/v1.0/payment/failure","field9":"","field8":"","amount_split":"{\"PAYU\":\"718.10\"}","field3":"326518227617874","field2":"749779","field5":"05","PG_TYPE":"HDFCPG","field4":"dTdEUnV5RGgwa3lNV3VWblMyZFM=","name_on_card":"Test","txnStatus":"SUCCESS","txnMessage":"Transaction Successful" };
    }

    private processPaymentResponse(data: any): void {
        this.paymentService.paymentResponse(data).subscribe((result: any) => {
            if (result.status !== 'PaymentCancelled') {
                this.dataStoreService.push('payment-result', result);                        
                const url = (result.status === 'PaymentSuccess' ? RouteKeys.PaymentSuccess : RouteKeys.PaymentFailure);
                this.router.navigate([url]);
            }                        
        }, (e: any) => {
            if (e.status === HttpStatusCode.BadRequest && e.error.name === 'InvalidRedeemPoints') {
                this.handleInvalidRedeemPoints(e);                
            } else {
                this.dataStoreService.push('payment-result', e);
                this.router.navigate([RouteKeys.PaymentFailure]);
            }
        });
    }

    private handleInvalidRedeemPoints(e: any): void {
        this.errors.push({ key: 'Invalid redeem points', error: 'Please enter points to redeem' });
        this.availableLoyaltyPoints = e.error.availablePoints;
        this.loyaltyPointsRedeem = 0;
        this.pointsToRedeem.focus();
        from([0]).pipe(delay(3000), first()).subscribe(_ => this.errors = []);
    }
}
