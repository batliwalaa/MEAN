import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { CommonAppModule } from '@common/src/public-api';
import { FooterComponent } from './components';
import { FooterService } from './footer.service';

@NgModule({ declarations: [FooterComponent],
    exports: [FooterComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [CommonAppModule], providers: [FooterService, provideHttpClient(withInterceptorsFromDi())] })
export class FooterModule {}
