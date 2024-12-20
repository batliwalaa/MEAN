import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { DocumentGenerationContextModel } from '../models/document-generation-context.model';

const DocumentGenerationContextCollection = () => {
    return DatabaseConnection().model<DocumentGenerationContextModel>('DocumentGenerationContextModel', new Schema<DocumentGenerationContextModel>(), 'DocumentGenerationContextData');
};

export default DocumentGenerationContextCollection;
