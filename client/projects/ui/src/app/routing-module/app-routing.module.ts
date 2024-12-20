import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
    MultiItemReviewComponent,
    OrderProductResolver,
    OrderProductReviewResolver,
    OrderProductsResolver,
    OrderReviewResolver,
    ReviewComponent,
    ContentComponent,
    ShoppingCartComponent
} from '@content/src/public-api';

import { MenuResolver, BurgerMenuResolver } from '@menu/src/public-api';
import { ErrorComponent, PageNotFoundComponent, NotSupportedOrientationComponent } from '@shell/src/public-api';
import { AuthGuard, MetadataResolver } from '@common/src/public-api';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'signin',
        children: [
            {
                path: '',
                loadChildren: () => import('@login/src/lib/login.module').then(m => m.LoginModule)
            },
        ],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'admin',
        children: [
            {
                path: '',
                loadChildren: () => import('@admin/src/lib/admin.module').then(m => m.AdminModule)
            },
        ],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'customer',
        children: [
            {
                path: '',
                loadChildren: () => import('@customer/src/lib/customer.module').then(m => m.CustomerModule)
            },
        ],
        runGuardsAndResolvers: 'always',
    },
    {
        path: 'account',
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@customer/src/lib/customer.module').then((m) => m.CustomerModule),
            },
        ],
        runGuardsAndResolvers: 'always',
    },
    {
        path: 'home',
        children: [
            {
                path: '',
                loadChildren: () => import('@content/src/lib/content.module').then((m) => m.ContentModule),
            },
        ],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'review/product/:productid/order/:orderid',
        component: ReviewComponent,
        canActivate: [AuthGuard],
        data: { resourceKeys: ['AddEditReview', 'BurgerMenu'] },
        resolve: { 
            menuData: MenuResolver,
            burgerMenu: BurgerMenuResolver,
            detail: OrderProductResolver,
            review: OrderProductReviewResolver,
            metadata: MetadataResolver
        }
    },
    {
        path: 'reviews/order/:orderid',
        component: MultiItemReviewComponent,
        canActivate: [AuthGuard],
        data: { resourceKeys: ['MultiItemReview', 'BurgerMenu'] },
        resolve: { 
            menuData: MenuResolver,
            burgerMenu: BurgerMenuResolver,
            products: OrderProductsResolver,
            reviews: OrderReviewResolver,
            metadata: MetadataResolver
        }
    },
    {
        path: 'product',
        component: ContentComponent,
        data: { resourceKeys: ['BurgerMenu'] },
        resolve: {
            burgerMenu: BurgerMenuResolver,
            metadata: MetadataResolver
        },
        children: [
            {
                path: '',
                loadChildren: () => import('@content/src/lib/content.module').then((m) => m.ContentModule),
            },
        ],
    },
    {
        path: 'shoppingcart',
        component: ShoppingCartComponent,
        data: { resourceKeys: ['BurgerMenu', 'ShoppingCart'] },
        resolve: {
            metadata: MetadataResolver,
            menuData: MenuResolver,
            burgerMenu: BurgerMenuResolver
        },
    },
    {
        path: 'checkout',
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('@checkout/src/lib/checkout.module').then((m) => m.CheckoutModule),
            },
        ],
        runGuardsAndResolvers: 'always',
    },
    {
        path: 'error/:type',
        component: ErrorComponent,
        pathMatch: 'full',
    },
    {
        path: 'notfound',
        component: PageNotFoundComponent,
        pathMatch: 'full',
    },
    {
        path: 'notsupportedorientation',
        component: NotSupportedOrientationComponent,
        pathMatch: 'full',
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true, onSameUrlNavigation: 'reload' })],
})
export class AppRoutingModule {}
