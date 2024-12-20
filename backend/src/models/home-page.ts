import { Section } from './section';

export interface HomePage {
    _id: any;
    layout: string;
    sections: Array<Section>;
    test?: boolean;
}
