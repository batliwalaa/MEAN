import { Document } from 'mongoose';
import { DocumentGenerationContext } from '../../services/tasks';

export interface DocumentGenerationContextModel extends DocumentGenerationContext, Document {}
