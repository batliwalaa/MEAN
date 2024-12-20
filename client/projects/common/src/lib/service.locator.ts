import { Injector } from '@angular/core';

export class ServiceLocator {
    private static _injector: Injector;

    public static set Injector(injector: Injector) {
        if (!ServiceLocator._injector) {
            ServiceLocator._injector = injector;
        }
    }

    public static get Injector(): Injector {
        return ServiceLocator._injector;
    }
}
