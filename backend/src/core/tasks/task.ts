import { TaskContext } from "./task.context";

export  interface ITask<T extends TaskContext> {
    isValid(state: T): boolean;
    process(state: T): Promise<T>;
}