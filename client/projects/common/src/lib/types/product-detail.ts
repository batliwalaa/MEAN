export interface ProductDetail {
    section: string;
    title: string;
    value: string;
    filter: boolean;
    displayType: 'list'|'table'|'text';
}