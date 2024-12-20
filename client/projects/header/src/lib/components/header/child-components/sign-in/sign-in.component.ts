import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteKeys, SearchStateService } from '@common/src/public-api';

@Component({
    selector: 'ui-signin',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SigninComponent {
    @Input() metadata: any;

    constructor(
        private searchStateService: SearchStateService,
        private router: Router
    ) {
    }
    
    onSignInClick(): void {
        this.searchStateService.clearQuickSearch$.next();
        this.router.navigateByUrl(RouteKeys.Signin);
    }

    onRegisterClick(): void {
        this.searchStateService.clearQuickSearch$.next();
        this.router.navigateByUrl(RouteKeys.Register);
    }
    
}
