import { ThisReceiver } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { DataStoreService } from "./data-store.service";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly defaultTimeout: number = 3000;
    private messages: Array<{key: string, body: string, title: string, type: string, timeout: number }>;
    private loaded: boolean = false;

    constructor (
        private toastr: ToastrService,
        private dataStoreService: DataStoreService
    ) {
    }

    public async showMessage(key: string): Promise<void> {
        await this.ensureMessagesLoaded();        
        const message = this.messages.find(m => m.key.toLowerCase() === key.toLowerCase());        
        if (message) {
            this.toastr.show(
                message.body,
                message.title,
                { timeOut: message.timeout || this.defaultTimeout },
                `toast-${message.type.toLowerCase()}`
            );
        }
    }

    private async ensureMessagesLoaded(): Promise<void> {
        if (!this.loaded) {
            this.messages = await this.dataStoreService.get('notification-messages');
            this.loaded = true;
        }
    }
}