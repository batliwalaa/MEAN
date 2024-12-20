import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { CommonAppModule } from '@common/src/public-api';
import { MenuComponent, HamburgerMenuComponent, SidebarMenuComponent, SubMenuComponent } from './components';

@NgModule({ declarations: [MenuComponent, HamburgerMenuComponent, SidebarMenuComponent, SubMenuComponent],
    exports: [MenuComponent, HamburgerMenuComponent, SidebarMenuComponent, SubMenuComponent], imports: [CommonAppModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class MenuModule {}
