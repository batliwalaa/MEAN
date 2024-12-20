export interface IModifier {
    modify(content: any): Promise<any>;
}
