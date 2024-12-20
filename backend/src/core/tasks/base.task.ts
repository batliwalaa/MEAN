import { Logging } from "../structured-logging/log-manager";
import { Logger } from "../structured-logging/logger";
import { ITask } from "./task";
import { TaskContext } from "./task.context";
import { TaskContextRepository } from '../../repositories';
import { TaskState } from "./task-state";
import { Document } from "mongoose";
import { Address } from "../../models";
import { isEmptyOrWhiteSpace } from "../utils";

export abstract class BaseTask<T extends TaskContext, D extends Document> implements ITask<T> {
    protected readonly logger: Logger = Logging.getLogger(this.constructor.name);
    constructor (
        protected contextRepository?: TaskContextRepository<D, T>
    ) {
    }

    public abstract isValid(state: T): boolean;
    public abstract execute(state: T): Promise<T>;
    
    public async process(state: T): Promise<T> {
        if (!state.continue) return state;

        try {
            return await this.execute(state);
        } catch(e) {
            this.contextRepository.setTaskState(state._id.toString(), TaskState.Failed);
            this.logger.error(`ERROR: PDF generate task failed - contextID: ${state._id.toString()}, contextType: ${state.contextType}`, { ...state, action: 'process' }, e);
            state.continue = false;
        }

        return state;
    }

    protected getAddressAsString(address: Address): string {
        let a = '';
        let addComma = false;

        const get = (value: any) => {
            let rValue = '';
            if (!isEmptyOrWhiteSpace(value)) {
                rValue = (addComma ? ', ' : '') + value;
                addComma = true;
            }
            return rValue;
        }

        if (address) {
            a += get(address.addressLine1);
            a += get(address.addressLine2);
            a += get(address.addressLine3);
            a += get(address.town);
            a += get(address.state);
            a += get(address.postcode);
            a += get(address.country);
        }

        return a;
    }
}