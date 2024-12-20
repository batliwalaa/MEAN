import { BaseComponent } from '@common/src/public-api';
import { Directive } from '@angular/core';

@Directive()
export abstract class BaseMenuComponent extends BaseComponent {
    getChildMenuTextItems(items: Array<any>): any {
        const cItems = items.filter((i) => i.itemType === 0);

        return { childItems: cItems };
    }

    getItem(item: any, category: string = null): any {
        return { item, category };
    }
}
