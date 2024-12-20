import { Injectable } from "../core/decorators";
import { KeyValuePair } from "../models";
import { SectionDefinition } from "../services/tasks/models/section-definition";

@Injectable()
export class MetadataService {
    private metadataCollection: Array<KeyValuePair<Array<SectionDefinition>>> = [];

    public add(kvp: KeyValuePair<Array<SectionDefinition>>): void {
        this.metadataCollection.push(kvp);
    }

    public find(key: string): Array<SectionDefinition> {
        const item: any = this.metadataCollection.find(kvp => kvp.Key === key);
        
        return item?.Value;
    }

    public findSection(key: string, sectionName: string): SectionDefinition {
        const item: KeyValuePair<Array<SectionDefinition>> = this.metadataCollection.find(kvp => kvp.Key === key);        
        return item?.Value.find(s => s.key === sectionName);
    }
}
