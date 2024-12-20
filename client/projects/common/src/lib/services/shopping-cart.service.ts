import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import { ShoppingCart } from '../types/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ShoppingCartService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public getShoppingCartForSession(): Observable<ShoppingCart> {
        return this.executePost('shopping_cart_session', `${this.baseUrl}/shopping/cart/session`, {});
    }

    public update(cart: ShoppingCart): Observable<void> {
        return this.executePost('shopping_cart_update', `${this.baseUrl}/shopping/cart/update`, { cart });
    }
}
