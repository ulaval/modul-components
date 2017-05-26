import { BUTTON_NAME, LIST_NAME, DYNAMIC_TEMPLATE_NAME } from './component-names';

export type OverviewType = 'rubric' | 'do' | 'dont';

export interface Overview {
    type: OverviewType;
    title: string;
    content: string;
}

export interface ComponentMeta {
    name: string;
    displayName: string;
    overview: Overview[];
}

type MetaMap = {
    [key: string]: ComponentMeta;
};

export class Meta {
    private meta: MetaMap = {
        [BUTTON_NAME]: require('./buttons/button.fr.json'),
        [LIST_NAME]: require('./lists/list.fr.json'),
        [DYNAMIC_TEMPLATE_NAME]: require('./text/dynamic-template.fr.json')
    };

    public getComponentKeys(): Array<string> {
        return Object.keys(this.meta).filter(key => this.meta.hasOwnProperty(key));
    }

    public getMeta(key: string): ComponentMeta {
        return this.meta[key];
    }
}

export default new Meta();
