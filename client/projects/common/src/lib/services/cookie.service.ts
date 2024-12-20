import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CookieService {
    private readonly documentIsAccessible: boolean;

    constructor(
        @Inject(DOCUMENT) private document: any,
        @Inject(PLATFORM_ID) platformId: any
    ) {
        this.documentIsAccessible = isPlatformBrowser(platformId);
    }

    public exists(name: string): boolean {
        if (!this.documentIsAccessible) {
            return false;
        }

        name = encodeURIComponent(name);
        const regExp: RegExp = this.getCookieRegExp(name);

        return regExp.test(this.document.cookie);
    }

    public get(name: string): string {
        if (this.exists(name)) {
            name = encodeURIComponent(name);

            const regExp: RegExp = this.getCookieRegExp(name);
            const result: RegExpExecArray = regExp.exec(this.document.cookie);

            if (result && result.length > 0) {
                return this.safeDecodeCookie(result[1]);
            }
        }

        return '';
    }

    public set(
        name: string,
        value: string,
        options?: {
            expires?: number | Date,
            path?: string,
            domain?: string,
            secure?: boolean,
            sameSite?: 'Lax' | 'None' | 'Strict'
        }
    ): void {
        if (!this.documentIsAccessible) {
            return;
        }
        const func = (key: string, value: string | boolean): string => {
            if (value) {
                return `${key}=${value.toString()};`
            }

            return '';
        }

        let cookieString: string = `${encodeURIComponent(name)}=${encodeURIComponent(value)};`;
        options = options || {};

        if (options.expires) {
            if (typeof options.expires === 'number') {
                const expires: Date = new Date(Date.now() + options.expires * 1000 * 60 * 60 * 24);
                cookieString += func('expires', expires.toUTCString());
            } else {
                cookieString += func('expires', options.expires.toUTCString());
            }
        }

        if (options.secure === false && options.sameSite === 'None') {
            options.secure = true;
        }

        cookieString += `${func('path', options.path)}${func('domain', options.domain)}${(options.secure ? 'secure;' : '')}${func('sameSite', (options.sameSite || 'Lax'))}`;

        this.document.cookie = cookieString;
    }

    public delete(
        name: string,
        path?: string,
        domain?: string,
        sameSite?: 'Lax' | 'None' | 'Strict',
        secure?: boolean
    ): void {
        if (!this.documentIsAccessible || !this.exists(name)) {
            return;
        }

        this.set(name, '', { expires: new Date('Thu 01 Jan 1970 00:00:01 GMT'), path, secure, sameSite, domain});
    }

    private getCookieRegExp(name: string): RegExp {
        const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi, '\\$1');
    
        return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
    }

    private safeDecodeCookie(data: string): string {
        try {
            return decodeURIComponent(data);
        } catch {
            return data;
        }
    }
}
