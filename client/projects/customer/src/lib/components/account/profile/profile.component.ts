import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationMessageKeys } from "@common/src/lib/constants/notification.message.keys";

import { DataStoreService, HistoryService, NotificationService, VerificationService, WINDOW } from "@common/src/public-api";
import { ProfileChangeProperty } from "../../../../../../typings/custom";
import { BaseAccountComponent } from "../base-account.component";

@Component({
    selector: 'ui-profile-component',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss']
})
export class ProfileComponent extends BaseAccountComponent {
    metadata: any;
    profile: any;
    showChange: boolean;
    type: ProfileChangeProperty;
    

    constructor(
        router: Router,
        @Inject(WINDOW) window: Window,
        dataStoreService: DataStoreService,
        historyService: HistoryService,
        private activatedRoute: ActivatedRoute,
        private verificationService: VerificationService,
        private notificationService: NotificationService
    ) {
        super (historyService, router, window, null, dataStoreService);
    }

    protected async init(): Promise<void> {
        this.metadata = this.activatedRoute.snapshot.data.metadata.AccountProfile;
        this.profile = this.activatedRoute.snapshot.data.profile;
        this.showChange = (await this.dataStoreService.get('profile-show-change', true)) ?? true;
        this.type = (await this.dataStoreService.get('profile-type', true)) ?? undefined;
        await super.init();
    }

    public async onClick(type: ProfileChangeProperty): Promise<void> {
        try {
            await this.verificationService.profileChangeOtp(type);

            this.showChange = false;
            this.type = type;
            
            await this.dataStoreService.push('profile-show-change', this.showChange, true);
            await this.dataStoreService.push('profile-type', type, true);
        } catch(e) {
            this.notificationService.showMessage(NotificationMessageKeys.GenericError);
        }
    }

    public async onResendOtpClick(type: ProfileChangeProperty): Promise<void> {
        try {
            await this.verificationService.profileChangeOtp(type);
            this.notificationService.showMessage(NotificationMessageKeys.OtpResend);
        } catch(e) {
            this.notificationService.showMessage(NotificationMessageKeys.GenericError);
        }
    }

    public async onCancel(): Promise<void> {
        this.showChange = true;
        this.type = undefined;
        
        await this.dataStoreService.push('profile-show-change', null, true);
        await this.dataStoreService.push('profile-type', null, true);

        await Promise.resolve();
    }
}
