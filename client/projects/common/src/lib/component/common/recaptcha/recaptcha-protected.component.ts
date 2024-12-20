import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'ui-recaptcha-protected',
    template: `<div class="container">
        <small
            >This site is protected by reCAPTCHA and the Google
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and
            <a href="https://policies.google.com/terms">Terms of Service</a> apply.
        </small>
    </div> `,
    styleUrls: ['./recaptcha-protected.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecaptchaProtectedComponent {}
