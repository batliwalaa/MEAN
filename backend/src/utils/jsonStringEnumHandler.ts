import { MenuItemType } from '../models/enums/menu-item-type';

export default (key: string, value: any) => {
    if (key === 'ItemType') {
        value = MenuItemType[parseInt(value)];
    }

    return value;
};
