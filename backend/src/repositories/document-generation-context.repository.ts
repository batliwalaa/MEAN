import { Injectable } from "../core/decorators";
import { TaskContextRepository } from ".";
import { DocumentGenerationContextModel } from "./models/document-generation-context.model";
import { DocumentGenerationContext } from "../services/tasks";
import DocumentGenerationContextCollection from "./collections/document-generation-context.collection";

@Injectable()
export class DocumentGenerationContextRepository extends TaskContextRepository<DocumentGenerationContextModel, DocumentGenerationContext>  {
    constructor() {
        super();
        this.taskContextCollection = DocumentGenerationContextCollection();
    }
}
