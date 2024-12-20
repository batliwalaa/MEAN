import { SectionDefinition } from "./section-definition";

export interface TemplateDefinition {
    key: string;
    sections: Array<SectionDefinition>; 
}