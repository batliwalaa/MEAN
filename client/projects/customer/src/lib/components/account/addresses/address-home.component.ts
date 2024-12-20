import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationMessageKeys } from "@common/src/lib/constants/notification.message.keys";
import { AuthService, HistoryService, NavigationService, NotificationService, AddressService, RouteKeys, WINDOW } from "@common/src/public-api";
import { BaseAccountComponent } from "../base-account.component";

@Component({
    selector: 'ui-address-home-component',
    templateUrl: 'address-home.component.html',
    styleUrls: ['address-home.component.scss']
})
export class AddressHomeComponent extends BaseAccountComponent {
    metadata: any;
    addresses: Array<any>;
    defaultAddress: any;

    constructor(
        router: Router,
        @Inject(WINDOW) window: Window,
        historyService: HistoryService,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private navigationService: NavigationService,
        private addressService: AddressService,
        private notificationService: NotificationService
    ) {
        super (historyService, router, window);
    }

    protected async init(): Promise<void> {
        this.metadata = this.activatedRoute.snapshot.data.metadata.AccountAddresses;
        this.addresses = this.activatedRoute.snapshot.data.profile;

        await super.init();
    } 
    
    public get fullName(): string {
        return `${this.authService.user.firstName} ${this.authService.user.lastName}`;
    }

    public addAddressClick(): void {
        let url = 'account/addresses/add';
        let currentUrl =  RouteKeys.AccountAddresses;

        this.navigationService.navigateForUrl(url, currentUrl, true);
    }

    public async  onDeleteClick(id: string): Promise<void> {
        try {
            await this.addressService.delete(id);

            this.removeAddress(id); 
            this.notificationService.showMessage(NotificationMessageKeys.AddressDeleted);
          
        } catch(e)  {
            this.notificationService.showMessage(NotificationMessageKeys.GenericError);
        }   
    }

    public async onEditClick(id: string): Promise<void> {
        try {
            let url = 'account/addresses/edit/' + id;
            let currentUrl =  RouteKeys.AccountAddresses;

            this.navigationService.navigateForUrl(url, currentUrl, true);

        } catch(e)  {
            this.notificationService.showMessage(NotificationMessageKeys.GenericError);
        } 
    }

    private removeAddress(id: string): void {
        const index = this.addresses.findIndex((a) => a._id === id);

        this.addresses.splice(index, 1);
    }
}
