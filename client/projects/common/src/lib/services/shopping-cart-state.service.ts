import { Injectable } from '@angular/core';
import { from, Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import { reduce, groupBy, mergeMap, toArray, delay, first, switchMap, catchError } from 'rxjs/operators';

import { ShoppingCartItem } from '../types/shopping-cart-item';
import { Product } from '../types/product';
import { ShoppingCart } from '../types/shopping-cart';
import { ShoppingCartService } from './shopping-cart.service';
import { TokenService } from './token.service';
import { NotificationService } from './notification.service';
import { NotificationMessageKeys } from '../constants/notification.message.keys';

@Injectable({ providedIn: 'root' })
export class ShoppingCartStateService {
    private _shoppingCart: ShoppingCart;
    private _totalQuantity = 0;

    constructor(
        private shoppingCartService: ShoppingCartService,
        private tokenService: TokenService,
        private notificationService: NotificationService
    ) {
        this.retrieveCart();
    }

    public cartStateChange: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public addItemToBasket(item: Product, quantity: number = 1): void {
        if (this._shoppingCart.items.length > 0) {
            const basketItem = this._shoppingCart.items.find((i) => i._id === item._id);

            if (basketItem) {
                basketItem.quantity += quantity;
            } else {
                this._shoppingCart.items.push({ ...item, quantity });
            }
        } else {
            this._shoppingCart.items.push({ ...item, quantity });
        }
        this.update('add');
    }

    public updateItemInBasket(item: Product, quantity: number): void {
        if (this._shoppingCart.items.length > 0) {
            const basketItem = this._shoppingCart.items.find((i) => i._id === item._id);

            if (basketItem) {
                basketItem.quantity = quantity;
            }

            this.update('update');
        }
    }

    public deleteItemFromBasket(item: Product): void {
        if (this._shoppingCart.items.length > 0) {
            const basketItem = this._shoppingCart.items.find((i) => i._id === item._id);

            if (basketItem) {
                this._shoppingCart.items.splice(this._shoppingCart.items.indexOf(basketItem), 1);
            }

            this.update('delete');
        }
    }

    public get totalQuantity(): number {
        return this._totalQuantity;
    }

    public get shoppingCart(): ShoppingCart {
        return this._shoppingCart;
    }

    public get groupBasketItems(): Observable<Array<ShoppingCartItem>> {
        return this.getGroupBasketItems();
    }

    public reset(): void {
        this._shoppingCart = null;
        this.retrieveCart();
    }

    private setTotalQuantity(): void {
        from(this._shoppingCart.items)
            .pipe(reduce((acc, cur) => acc + cur.quantity, 0))
            .subscribe((total) => {
                this._totalQuantity = total;
            });
    }

    private getGroupBasketItems(): Observable<any> {
        const sortedItems = this._shoppingCart.items.sort((a, b) => (a.lob > b.lob ? 1 : a.lob < b.lob ? -1 : 0));
        const source = from(sortedItems);

        return source.pipe(
            groupBy(
                (i) => i.lob,
                null,
                null,
                () => new ReplaySubject()
            ),
            mergeMap((g) => g.pipe(toArray()))
        );
    }

    private update(action?: string): void {
        this.shoppingCartService.update(this._shoppingCart)
            .pipe(
                first()
            )
            .subscribe((_) => {
                this.setTotalQuantity();
                this.cartStateChange.next(true);                
                switch (action) {
                    case 'add':
                        this.notificationService.showMessage(NotificationMessageKeys.ShoppingCartAdd);
                        break;
                    case 'delete':
                        this.notificationService.showMessage(NotificationMessageKeys.ShoppingCartUpdate);
                        break;
                    case 'update':
                        this.notificationService.showMessage(NotificationMessageKeys.ShoppingCartDelete);
                        break;
                }
                
            });
    }

    private retrieveCart(): void {
        from([0])
            .pipe(
                delay(1000),
                switchMap((_) => this.tokenService.xsrf()),
                switchMap((_) => this.shoppingCartService.getShoppingCartForSession()),
                catchError(_ => null),
                first()
            )
            .subscribe((cart) => {
                if (cart) {
                    this._shoppingCart = cart as ShoppingCart;
                    this.setTotalQuantity();
                    this.cartStateChange.next(true);                
                }
            });
    }
}
