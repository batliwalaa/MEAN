export interface FooterItem {
    _id: any;
    label: string;
    url: string;
    order: number;
    childItems: Array<FooterItem>;
    test?: boolean;
}
