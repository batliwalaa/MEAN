import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuResolver, BurgerMenuResolver } from '@menu/src/public-api';
import { ListContentComponent, HomePageComponent, DetailContentComponent, ContentComponent } from '../components';
import { HomePageResolver } from '../resolvers/homepage.resolver';
import { ListDataResolver } from '../resolvers/list-data.resolver';
import { DetailResolver } from '../resolvers/detail.resolver';
import { PackSizesResolver } from '../resolvers/pack-sizes.resolver';
import { MetadataResolver } from '@common/src/public-api';
import { ProductReviewsResolver } from '../resolvers/product-reviews.resolver';

const routes: Routes = [
    {
        path: '',
        component: ContentComponent,
        data: { page: 'homepage', resourceKeys: ['BurgerMenu'] },
        resolve: {
            menuData: MenuResolver,
            burgerMenu: BurgerMenuResolver,
            metadata: MetadataResolver
        },
        children: [
            {
                path: '',
                component: HomePageComponent,
                resolve: {
                    homeData: HomePageResolver
                },
            },    
            {
                path: 'list/:query',
                component: ListContentComponent,
                data: { resourceKeys: ['Content'] },
                resolve: {
                    metadata: MetadataResolver,
                    listData: ListDataResolver,
                    menuData: MenuResolver
                }
            },
            {
                path: 'detail/:id',
                component: DetailContentComponent,
                data: { resourceKeys: ['Content', 'ViewReview'] },
                resolve: {
                    metadata: MetadataResolver,
                    detail: DetailResolver,
                    reviews: ProductReviewsResolver,
                    sizes: PackSizesResolver
                },
            },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContentRoutingModule {}
