import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WINDOW } from './window.service';
@Injectable({
    providedIn: 'root',
})
export class DataStoreService {
    constructor(@Inject(WINDOW) private window: any) {}

    public push(key: string, data: any, useSessionStorage: boolean = true): Promise<void> {
        return new Promise((resolve, _) => {
            const dataStore = this.getDataStore(useSessionStorage);
            if (data !== null && data !== undefined) {
                dataStore[key] = data;
            } else {
                delete dataStore[key];
            }
            if (this.window.sessionStorage) {
                this.window[(useSessionStorage ? 'sessionStorage' : 'localStorage')]
                    .setItem('data-store', JSON.stringify(dataStore));
            }

            resolve();
        });
    }

    public async get(key: string, useSessionStorage: boolean = true): Promise<any> {
        return new Promise((resolve, _) => {
            const dataStore = this.getDataStore(useSessionStorage);
            resolve(dataStore[key]);
        });
    }

    private getDataStore(useSessionStorage: boolean = true): any {
        let dataStore = {};
        if ((useSessionStorage && this.window.sessionStorage) || (!useSessionStorage && this.window.localStorage)) {
            const localData = this.window[(useSessionStorage ? 'sessionStorage' : 'localStorage')].getItem('data-store');
            if (localData) {
                dataStore = JSON.parse(localData);
            }
        }

        return dataStore;
    }
}
