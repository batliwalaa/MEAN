import { SearchMap } from './search-map';

export interface CacheItem {
    CacheType: string;
    Key: string;
    Type?: string;
    Brand?: string;
    SubType?: string;
    PageNumber?: number;
    Term?: string;
    searchMap?: SearchMap;
}
