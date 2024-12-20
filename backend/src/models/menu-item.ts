export interface MenuItem {
    _id: any;
    label: string;
    url: string;
    itemType: string;
    imageUrl: string;
    childItems: Array<MenuItem>;
    sideBarItems: Array<MenuItem>;
    tooltip: string;
    imageAltText: string;
    highlight: boolean;
    sale: boolean;
    childItemsVisibleOnhover: boolean;
    test?: boolean;
    order: number;
    active: boolean;
}
