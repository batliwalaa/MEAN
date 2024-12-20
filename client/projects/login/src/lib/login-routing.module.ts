import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetadataResolver, NotAuthenticatedGuard } from '@common/src/public-api';
import { BurgerMenuResolver } from '@menu/src/public-api';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        canActivate: [NotAuthenticatedGuard],
        pathMatch: 'full',
        data: { resourceKeys: ['SignIn', 'BurgerMenu'] },
        resolve: {
            metadata: MetadataResolver,
            burgerMenu: BurgerMenuResolver
        },
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LoginRoutingModule {}

