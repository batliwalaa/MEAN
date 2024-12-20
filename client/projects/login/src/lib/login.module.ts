import { NgModule } from '@angular/core';

import { CommonAppModule } from '@common/src/public-api';
import { LoginComponent } from './components/login/login.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        CommonAppModule,
        LoginRoutingModule
    ],
})
export class LoginModule {}
