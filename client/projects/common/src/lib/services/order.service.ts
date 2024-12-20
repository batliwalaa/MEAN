import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID, TransferState } from "@angular/core";

import { Observable } from "rxjs";
import { OrderStatus } from "../types/order-status";
import { ConfigService } from "./config.service";
import { HttpService } from "./http.service";

@Injectable({
    providedIn: 'root'
})
export class OrderService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public search(pn: number, from: number, to: number): Observable<Array<any>> {
        const query = btoa(JSON.stringify({ from, to }));

        return this.executeGet('customer-orders', `${this.baseUrl}/order/search/${pn}/${query}`);
    }

    public get(orderID: string): Observable<any> {
        return this.executeGet(`customer-order-${orderID}`, `${this.baseUrl}/order/${orderID}`);
    }

    public getProductForOrder(orderID: string, productID: string): Observable<any> {
        return this.executeGet(`order-product-${orderID}-${productID}`, `${this.baseUrl}/order/${orderID}/product/${productID}`);
    }

    public getOrderProducts(orderID: string): Observable<any> {
        return this.executeGet(`order-products-${orderID}`, `${this.baseUrl}/order/${orderID}/products`);
    }

    public cancelOrder(orderID: string): Observable<any> {
        return this.httpClient.patch(`${this.baseUrl}/order/${orderID}`, {status: OrderStatus.Cancelled.toString()});
    }
}
