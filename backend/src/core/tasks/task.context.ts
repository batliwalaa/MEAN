export interface TaskContext {
    _id: any;
    continue: boolean;
    contextType: 'Invoice' | 'CreditNote';
    failed?: boolean;
}