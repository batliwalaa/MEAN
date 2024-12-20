import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, MetadataResolver } from '@common/src/public-api';

import { CustomerOrdersResolver } from '../resolvers/customer-orders.resolver';
import { CustomerOrderDetailResolver } from '../resolvers/customer-order-detail.resolver';

import { HomeComponent } from '../components/account/home/home.component';
import { OrderListComponent } from '../components/account/orders/order-list/order-list.component';
import { OrderComponent } from '../components/account/orders/order/order.component';
import { ProfileComponent } from '../components/account/profile/profile.component';
import { ProfileResolver } from '../resolvers/profile.resolver';
import { BurgerMenuResolver, MenuResolver } from '@menu/src/public-api';
import { AddressHomeComponent } from '../components/account/addresses/address-home.component';
import { AddressResolver } from '../resolvers/address.resolver';
import { AccountAddressComponent } from '../components/account/addresses/child-components/address/account-address.component'
import { StateCountyProvinceResolver } from '@checkout/src/lib/resolvers/state-county-province.resolver';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { resourceKeys: ['BurgerMenu', 'Account'] },
        resolve: {
            menuData: MenuResolver,
            burgerMenu: BurgerMenuResolver,
            metadata: MetadataResolver
        },
        runGuardsAndResolvers: 'always',
    },
    {
        path: 'orders',
        component: OrderListComponent,
        canActivate: [AuthGuard],
        data: { resourceKeys: ['AccountOrders'] },
        resolve: { 
            metadata: MetadataResolver,
            orderList: CustomerOrdersResolver
        },
    },
    {
        path: 'order/:id',
        component: OrderComponent,
        canActivate: [AuthGuard],
        data: { resourceKeys: ['AccountOrderDetail'] },
        resolve: { 
            metadata: MetadataResolver,
            orderResult: CustomerOrderDetailResolver
        },
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        data: { resourceKeys: ['AccountProfile'] },
        resolve: { 
            metadata: MetadataResolver,
            profile: ProfileResolver
        },
    },
    {
        path: 'addresses',
        component: AddressHomeComponent,
        canActivate: [AuthGuard],
        data: { resourceKeys: ['AccountAddresses'] },
        resolve: { 
            metadata: MetadataResolver,
            profile: AddressResolver
        },
    },
    {
        path:'addresses/add',
        component: AccountAddressComponent,
        canActivate: [AuthGuard],
        data: { resourceKeys: ['AccountAddressAdd'] },
        resolve: { 
            metadata: MetadataResolver,
            states: StateCountyProvinceResolver,          
        },
    },
    {
        path:'addresses/edit/:id',
        component: AccountAddressComponent,
        canActivate: [AuthGuard],
        data: { resourceKeys: ['AccountAddressEdit'] },
        resolve: { 
            metadata: MetadataResolver,          
            states: StateCountyProvinceResolver,          
        },
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountRoutingModule {}
