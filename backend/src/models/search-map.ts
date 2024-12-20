import { KeyValuePair } from './key-value-pair';

export interface SearchMap {
    lob?: string;
    types?: Array<string>;
    subTypes?: Array<string>;
    brands?: Array<string>;
    description?: string;
    filters?: Array<KeyValuePair<any>>;
    searchString?: string;
    category?: string
}
