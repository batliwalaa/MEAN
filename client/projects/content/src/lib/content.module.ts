import { NgModule } from '@angular/core';

import { CommonAppModule } from '@common/src/public-api';
import { MenuModule } from '@menu/src/public-api';
import { ContentRoutingModule } from './routing-module/content-routing.module';
import {
    ContentComponent,
    HomePageComponent,
    ListContentComponent,
    ItemContainerComponent,
    DetailContentComponent,
    ShoppingCartComponent,
    AddToBasketComponent,
    AddToShoppingcartQuantityComponent,
    PricingComponent,
    ViewReviewComponent,
    ReviewComponent,
    ImageLightboxComponent,
    MultiItemReviewComponent,
} from './components';
import { ProceedToBuyComponent } from './components/shopping-cart/child-components/proceed-to-buy/proceed-to-buy.component';
import { GroupContainerComponent } from './components/shopping-cart/child-components/group-container/group-container-component';
import { ShoppingcartItemContainerComponent } from './components/shopping-cart/child-components/shoppingcart-item-container/shoppingcart-item-container-component';
import { DetailDescriptionComponent } from './components/detail/child-components/detail-description.component';

@NgModule({
    declarations: [
        ContentComponent,
        HomePageComponent,
        ListContentComponent,
        ItemContainerComponent,
        DetailContentComponent,
        ShoppingCartComponent,
        AddToBasketComponent,
        AddToShoppingcartQuantityComponent,
        ProceedToBuyComponent,
        GroupContainerComponent,
        ShoppingcartItemContainerComponent,
        PricingComponent,
        ViewReviewComponent,
        ReviewComponent,
        ImageLightboxComponent,
        MultiItemReviewComponent,
        DetailDescriptionComponent
    ],
    imports: [ContentRoutingModule, CommonAppModule, MenuModule],
    exports: [ContentComponent, ReviewComponent, MultiItemReviewComponent],
})
export class ContentModule {}
