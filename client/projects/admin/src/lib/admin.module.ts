import { NgModule } from '@angular/core';
import { CommonAppModule } from '@common/src/public-api';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin.component';

@NgModule({
    declarations: [AdminComponent],
    imports: [CommonAppModule, AdminRoutingModule]
})
export class AdminModule {}
