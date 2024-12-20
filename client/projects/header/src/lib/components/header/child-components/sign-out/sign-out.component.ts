import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountService, NavigationService, SearchStateService } from '@common/src/public-api';

@Component({
    selector: 'ui-signout',
    templateUrl: './sign-out.component.html',
    styleUrls: ['./sign-out.component.scss'],
})
export class SignoutComponent {
    private _firstName: string;

    @Input()
    get firstName(): string {
        return this._firstName && this._firstName.length > 0 ? `, ${this._firstName}` : '';
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    @Input() metadata: any;
    @Output() signout = new EventEmitter<void>();
    show: boolean;

    constructor(
        private navigationService: NavigationService,
        private accountService: AccountService
    ) { }

    public async onSignoutClick(): Promise<void> {
        await this.navigationService.clear();
        this.signout.emit();
    }

    public async onOptionClick(key: string): Promise<void> {
        await this.accountService.navigate(key);
    }
}
