import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthState {
    private static _refreshing: boolean = false;

    public static get Refreshing(): boolean {
        return AuthState._refreshing;
    }

    public static set Refreshing(value: boolean) {
        AuthState._refreshing = value;
    }
}
