import { NgModule } from '@angular/core';
import { CommonAppModule } from '@common/src/public-api';

import { QuickSearchComponent } from './components';

@NgModule({
    declarations: [QuickSearchComponent],
    imports: [CommonAppModule],
    exports: [QuickSearchComponent],
})
export class SearchModule {}
