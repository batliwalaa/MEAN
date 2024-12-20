export class Result<T> {
    readonly items: Array<T>;
    readonly count: number;

    constructor(items: Array<T>, count: number) {
        this.items = items;
        this.count = count;
    }
};
