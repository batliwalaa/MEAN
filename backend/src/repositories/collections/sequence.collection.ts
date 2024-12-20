import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { SequenceModel } from '../models/sequence.model';

const SequenceCollection = () => {
    return DatabaseConnection().model<SequenceModel>('SequenceModel', new Schema<SequenceModel>(), 'Sequence');
};

export default SequenceCollection;
