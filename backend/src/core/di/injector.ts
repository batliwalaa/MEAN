import { Type } from '../../typings/decorator';

const Injector = new (class {
    private _collections: Array<{ collectionType: string, items: Array<Type<any>> }> = 
        new Array<{ collectionType: string, items: Array<Type<any>> }>();
    private _singletons: Array<{ type: Type<any>; instance: any }> =
        new Array<{ type: Type<any>; instance: any }>();
    private _environment: any;

    resolve<T>(target: Type<any>): T {
        if (this._singletons.findIndex((s) => s.type === target) === -1) {
            let tokens = Reflect.getMetadata('design:paramtypes', target) || [];
            let injections = tokens.map((t: any) => Injector.resolve<any>(t));

            return new target(...injections);
        }

        return this._singletons.find((s) => s.type === target).instance;
    }

    resolveSingleton<T>(target: Type<T>): T {
        const singleton = this._singletons.find((s) => s.type === target);

        if (!singleton) {
            throw new Error(`Injector cannot find type: ${target}`);
        }

        return singleton.instance;
    }

    resolveCollection(collectionType: string): any {
        let collection: Array<any> = [];

        let c = this._collections.find(c => c.collectionType.toLowerCase() === collectionType.toLowerCase());
        if (c) {
            for (let i = 0; i < c.items.length; i++) {
                collection.push(this.resolve(c.items[i]));
            }
        }

        return collection;
    }

    registerSingleton<T>(target: Type<any>): void {
        const instance = this.resolve(target);

        this._singletons.push({ type: target, instance });
    }

    registerEnvironmentInstance(environmentInstance: any): any {
        this._environment = environmentInstance;
    }

    getEnvironmentInstance(): any {
        return this._environment;
    }

    addToCollection(collectionType: string, target: Type<any>): void {
        let collection = this._collections.find(c => c.collectionType.toLowerCase() === collectionType.toLowerCase());
        if (!collection) {
            collection = { collectionType, items: new Array<Type<any>>() }
            this._collections.push(collection);
        }
        const item = collection.items.find(i => i === target);
        if (!item) {
            collection.items.push(target);
        }
    }
})();

export { Injector };
