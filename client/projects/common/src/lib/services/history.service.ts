import { Injectable } from "@angular/core";
import { RouteKeys } from "../constants/route.keys";
import { HistoryItem } from "../types/history-item";
import { DataStoreService } from "./data-store.service";
import { MenuStateService } from "./menu-state.service";

@Injectable({
    providedIn: 'root'
})
export class HistoryService {
    constructor (
        private dataStoreService: DataStoreService,
        private menuStateService: MenuStateService
    ) { }

    public async pop(): Promise<string> {
        const history = await this.dataStoreService.get('history');

        if (Array.isArray(history) && history.length > 0) {
            const item = history.pop();            
            await this.dataStoreService.push('history', history);

            if (Array.isArray(item.storeData) && item.storeData.length > 0) {
                for (let i = 0; i < item.storeData.length; i++) {
                    await this.dataStoreService.push(item.storeData[i].Key, item.storeData[i].Value);

                    if (item.storeData[i].Key === 'menu-state') {
                        const menuState = item.storeData[i].Value;
                        
                        if (menuState) {
                            this.menuStateService.changeShowMainMenu(menuState.showMainMenu);
                            this.menuStateService.changeMainMenuKey(menuState.mainMenuKey);
                            this.menuStateService.changeSubMenuKey(menuState.subMenuKey);
                            this.menuStateService.changeShowSubMenu(menuState.showSubMenu);
                        }
                    }
                }
            }


            return item.url;
        }

        return null;
    }

    public async push(item: HistoryItem): Promise<void> {
        let history: Array<HistoryItem> = await this.dataStoreService.get('history');

        if (!history) {
            history = new Array<HistoryItem>();
        }
        
        history.push(item);

        await this.dataStoreService.push('history', history);
    }

    public async clear(): Promise<void> {
        await this.dataStoreService.push('history', null);
    }

    public async hasItems(): Promise<boolean> {
        const history = await this.dataStoreService.get('history');
        return Array.isArray(history) && history.length > 0;
    }
}