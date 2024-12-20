import { TaskContext } from "./task.context";
import { ITask } from "./task";

export interface ITaskOrderable<T extends TaskContext> {
    orderedList(): Array<ITask<T>>;
}