import { BUTTON_NAME, LIST_NAME, DYNAMIC_TEMPLATE_NAME } from './component-names';

export interface Portrait {
    type: string;
    title: string;
    content: string;
}

export interface ComponentMeta {
    portrait: Portrait;
}

type MetaMap = {
    [key: string]: ComponentMeta;
};

class Meta {
    private meta: MetaMap = {
        [BUTTON_NAME]: require('./buttons/button.fr.json'),
        [LIST_NAME]: require('./lists/list.fr.json'),
        [DYNAMIC_TEMPLATE_NAME]: require('./text/dynamic-template.fr.json')
    };

    public getMeta(key: string): ComponentMeta {
        return this.meta[key];
    }
}

export default new Meta();
