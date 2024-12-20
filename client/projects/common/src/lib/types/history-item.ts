import { KeyValuePair } from "./key-value-pair";

export interface HistoryItem {
    url: string;
    storeData?: Array<KeyValuePair>;    
}