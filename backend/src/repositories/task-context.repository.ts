import { Document, Model, Types } from 'mongoose';
import { TaskContext, TaskState } from '../core/tasks';

export abstract class TaskContextRepository<T extends Document, E extends TaskContext> {
    protected taskContextCollection: Model<T, any>;

    constructor() {
    }

    public async getForOrderIDAndContextType(
        orderID: string,
        contextType: 'Invoice' | 'CreditNote'
    ): Promise<E> {
        const r = await this.taskContextCollection.findOne({ orderID, contextType });
        return r && r._doc ? r._doc : r
    }

    public async setTaskState(id: string, taskState: TaskState): Promise<void> {
        const r = await this.taskContextCollection.collection.updateOne(
            { _id: Types.ObjectId(id) },
            { $set: { taskState } },
            { bypassDocumentValidation: true }
        );
    }

    public async save(state: E): Promise<string> {
        if (!state._id) {
            const r = await this.taskContextCollection.collection.insertOne(state);
            return  r && r.insertedId ? r.insertedId.toString() : null;
        } else {
            const data = { ...state };
            delete data._id
            const r = await this.taskContextCollection.collection.updateOne(
                { _id: Types.ObjectId(state._id) },
                { $set: data },
                { bypassDocumentValidation: true }
            );
        }
    }
}
