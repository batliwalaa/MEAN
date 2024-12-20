import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class HamburgerMenuStateService {
    constructor() {}

    public showMenu: boolean = false;
    public showChildMenu: boolean = false;
}
