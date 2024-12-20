import { NgModule } from '@angular/core';
import { CommonAppModule } from '@common/src/public-api';
import { SearchModule } from '@search/src/public-api';
import { FooterModule } from '@footer/src/public-api';
import { HeaderModule } from '@header/src/public-api';
import { ShellComponent } from './components/shell/shell.component';
import { ErrorComponent } from './components/error/error.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NotSupportedOrientationComponent } from './components/not-supported-orientation/not-supported-orientation.component';

@NgModule({
    declarations: [ShellComponent, ErrorComponent, PageNotFoundComponent, NotSupportedOrientationComponent],
    imports: [CommonAppModule, SearchModule, FooterModule, HeaderModule],
    exports: [ShellComponent, ErrorComponent, PageNotFoundComponent, NotSupportedOrientationComponent],
})
export class ShellModule {}
