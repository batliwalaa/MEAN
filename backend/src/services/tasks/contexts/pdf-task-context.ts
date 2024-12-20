import { TaskState } from "../../../core/tasks";
import { TaskContext } from "../../../core/tasks/task.context";
import { TemplateDefinition } from "../models/template-definition";

export interface PDFTaskContext extends TaskContext {
    taskState: TaskState;
    document?: PDFKit.PDFDocument;
    templateDefinition?: TemplateDefinition
    font: string;
    fontBold: string;
    fileName?: string;
}