import { KeyValuePair } from './key-value-pair';

export interface OrderSearchMap {
    from?: Date;
    to?: Date;
    query?: Array<KeyValuePair<any>>;
}
