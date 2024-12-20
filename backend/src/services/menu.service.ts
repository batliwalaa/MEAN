import { Injectable } from '../core/decorators';
import { MenuRepository } from '../repositories/menu.repository';
import { BaseService } from './base.service';
import { RedisService } from '../cache';
import { Types } from 'mongoose';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class MenuService extends BaseService {
    constructor(
        private menuRepository: MenuRepository,
        private productRepository: ProductRepository,
        redisService: RedisService
    ) {
        super(redisService);
    }

    public async get(key: string, device: string, sidebar: boolean = false): Promise<any> {
        const cacheKey = `/menu`;

        return await this.execute(
            cacheKey,
            84600,
            () => this.menuRepository.getAll(),
            undefined,
            async (items: Array<any>) => this.filter(key, device, items, sidebar)
        );
    }

    public async getProductSidebar(key: string): Promise<any> {
        const json = JSON.parse(Buffer.from(key, 'base64').toString('utf-8'));
        const cacheKey = `/menu/:${key}`;

        const funcs = [
            () => this.productRepository.getBrandsForSearchMap(json),
            () => this.productRepository.getSubTypeForSearchMap(json),
            () => this.productRepository.getProductFilters(json),
        ];

        const sideBar: { brands: Array<string>, filters: Array<string>, subTypes: Array<string> } = await this.executeAll(cacheKey, 84600, funcs, this.aggregator);
        const sideBarItems: Array<{ key?: string, controlType?: string,  menuItems?: Array<{ label: string }> }> = [];
        

        if (json && json.types) {
            sideBarItems.push({ key: json.types[0], controlType: 'Checkbox', menuItems: [] });
        }
        sideBarItems.push({ controlType: 'Checkbox', menuItems: this.getMenuItems(sideBar.subTypes) });
        sideBarItems.push({ key: 'brands', controlType: 'Checkbox', menuItems: this.getMenuItems(sideBar.brands) });

        const filters: any = sideBar.filters;

        for (let i = 0; i < filters.length; i++) {
            sideBarItems.push({ key: filters[i].key, controlType: 'Checkbox', menuItems: this.getMenuItems(filters[i].values) });
        }

        return sideBarItems;
    }

    private getMenuItems(items: Array<string>): Array<{label: string}> {
        const values: Array<{label: string}> = [];

        for (let i = 0; i < items.length; i++) {
            values.push({ label: items[i] });
        }

        return values;
    }

    private filter(key: string, device: string, items: Array<any>, sidebar: boolean = false): Array<any> {
        const filteredItems = items.filter((i) => i.key.toLowerCase() === key.toLowerCase());

        if (filteredItems.length) {
            let deviceSpecificItem =
                filteredItems.length > 0 &&
                filteredItems.find((fi) => fi.device && fi.device.toLowerCase() === device.toLowerCase());

            if (!deviceSpecificItem) {
                deviceSpecificItem =
                    filteredItems.length > 0 &&
                    filteredItems.find((fi) => !fi.device || fi.device.toLowerCase() === '*');
            }

            if (sidebar) {
                return this.sidebarMenu(items, deviceSpecificItem);
            }

            if (key.toLowerCase() === 'burger menu') {
                this.setSubMenuId(deviceSpecificItem);
            }

            return deviceSpecificItem.menuItems;
        }

        return undefined;
    }

    private sidebarMenu(items: Array<any>, deviceSpecificItem: any): any {
        const sideBar: any = items.find((i) => i.key.toLowerCase() === 'sidebar');
        const sideBarItems: Array<any> = [];

        if (
            sideBar &&
            sideBar.menuItems &&
            sideBar.menuItems.length &&
            deviceSpecificItem.sideBarKeys &&
            deviceSpecificItem.sideBarKeys.length
        ) {
            deviceSpecificItem.sideBarKeys.forEach((sb: any) => {
                const keyItem = sideBar.menuItems.find((mi: any) => mi.key.toLowerCase() == sb.key.toLowerCase());

                if (keyItem) {
                    sb.menuItems = keyItem.menuItems;
                    sideBarItems.push({ key: sb.key, controlType: sb.controlType, menuItems: keyItem.menuItems });
                }
            });
        }

        return sideBarItems;
    }

    private setSubMenuId(deviceSpecificItem: any): void {
        deviceSpecificItem.menuItems.forEach((i: any) => {
            i.id = Types.ObjectId();

            if (i.childItems) {
                i.childItems.forEach((ci: any) => {
                    ci.id = Types.ObjectId();

                    if (ci.childItems) {
                        ci.childItems.forEach((c: any) => {
                            c.id = Types.ObjectId();
                        });
                    }
                });
            }
        });
    }

    private aggregator(dataItems: Array<any>): any {
        return {
            brands: dataItems[0],
            subTypes: dataItems[1],
            filters: dataItems[2]
        };
    }
}
