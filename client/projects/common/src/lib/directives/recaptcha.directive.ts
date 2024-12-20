import { Directive, HostListener, Input, OnInit, Output, EventEmitter, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../component/base.component';
import { ConfigService } from '../services/config.service';
import { RecaptchaService } from '../services/recaptcha.service';
import { Router } from '@angular/router';
import { WINDOW } from '../services/window.service';

@Directive({
    selector: '[uiRecaptcha]',
})
export class RecaptchaDirective extends BaseComponent implements OnInit, AfterViewInit {
    @Output() execute = new EventEmitter<any>();
    @Output() recaptchaVerificationFailure = new EventEmitter<void>();
    @Input() action: string;
    @Input() enabled: boolean;
    @Input() valid: boolean = true;

    private recaptchaKey: string;
    private recaptchaUrl: string;
    private recaptchaUse: boolean;
    private clickEvent = new Subject();

    constructor(
        @Inject(DOCUMENT) private document: any,
        private recaptchaService: RecaptchaService,
        @Inject(WINDOW) window: Window,
        router: Router,
        configService: ConfigService
    ) {
        super(router, window);
        this.recaptchaKey = configService.getConfiguration().recaptchaSiteKey;
        this.recaptchaUrl = configService.getConfiguration().recaptchaSiteUrl;
        this.recaptchaUse = configService.getConfiguration().recaptchaUse;
    }

    protected async init(): Promise<void> {
        this.enabled = true;
        this.clickEvent.pipe(takeUntil(this.$destroy)).subscribe((e) => this.execute.emit(e));
    }

    async ngAfterViewInit(): Promise<void> {
        await this.addScript();
    }

    @HostListener('click', ['$event'])
    async onClick($event: any): Promise<void> {
        $event.preventDefault();

        if (this.valid) {
            if (this.recaptchaUse && this.enabled) {
                await this.verify($event);
            } else {
                await this.verificationSuccess($event);
            }
        }
    }

    private async verify($event): Promise<void> {
        try {
            const captchaState = await this.recaptchaService.execute(this.action);

            if (captchaState.state === 'RecaptchaVerificationSuccess') {
                await this.verificationSuccess($event);
            } else {
                // TODO: define user friendly process
                // this.recaptchaVerificationFailure.emit();
                await this.verificationSuccess($event);
            }
        } catch (e) {
            // TODO: define user friendly process
            // this.recaptchaVerificationFailure.emit();
            await this.verificationSuccess($event);
        }
    }

    private async verificationSuccess($event: any): Promise<void> {
        await this.tokenService.xsrf();
        this.clickEvent.next($event);
    }

    private async addScript(): Promise<void> {
        return new Promise((resolve, _) => {
            if (this.recaptchaUse) {
                const url = this.recaptchaUrl;
                const scripts = this.document.body.getElementsByTagName('script');
                let found = false;

                for (var i = 0; i < scripts.length; i++) {
                    if (scripts[i].src.includes(url)) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    const script = this.document.createElement('script');
                    script.src = `${url}?render=${this.recaptchaKey}`;
                    this.document.body.appendChild(script);
                }
            }
            resolve();
        });
    }
}
