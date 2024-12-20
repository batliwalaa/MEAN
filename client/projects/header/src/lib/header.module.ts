import { NgModule } from '@angular/core';
import { CommonAppModule } from '@common/src/public-api';
import { MenuModule } from '@menu/src/public-api';
import { SearchModule } from '@search/src/public-api';
import { HeaderComponent } from './components/header/header.component';
import { SigninComponent } from './components/header/child-components/sign-in/sign-in.component';
import { SignoutComponent } from './components/header/child-components/sign-out/sign-out.component';
// import { CheckoutModule } from '@checkout/src/public-api';
import { NonContentHeaderComponent } from './components/non-content-header/non-content-header.component';
import { LocationComponent } from './components/header/child-components/location/location.component';

@NgModule({
    declarations: [
        HeaderComponent,
        NonContentHeaderComponent,
        SigninComponent,
        SignoutComponent,
        LocationComponent
    ],
    imports: [CommonAppModule, MenuModule, SearchModule],
    exports: [HeaderComponent, NonContentHeaderComponent],
})
export class HeaderModule {}
