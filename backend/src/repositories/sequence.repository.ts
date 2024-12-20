import { Model, Types } from 'mongoose';
import { Injectable } from '../core/decorators';
import { SequenceCollection } from './collections';
import { SequenceModel } from './models/sequence.model';

@Injectable()
export class SequenceRepository {
    private sequenceCollection: Model<SequenceModel, any>;
    private readonly seed: number = 10000;
    constructor() {
        this.sequenceCollection = SequenceCollection();
    }

    public async next(datacenter: number, worker: number): Promise<number> {
        let seq = await this.sequenceCollection.findOne({ datacenter, worker });
        if (!seq) {
            const r = await this.sequenceCollection.collection.insertOne({
                datacenter, worker, current: (this.seed + 1)
            });

            return this.seed + 1;
        } 

        const next = (seq && seq._doc ? seq._doc.current : seq.current) + 1;
        const id =  seq && seq._doc ? seq._doc._id : seq._id;

        const r = await this.sequenceCollection.collection.updateOne(
            { _id : id },
            { $set: { current: next } },
            { bypassDocumentValidation: true }
        )
        
        return next;
    }
}
