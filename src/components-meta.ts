export interface ComponentPortrait {
    type: string;
    title: string;
    content: string;
}

export interface ComponentMeta {
    portrait: ComponentPortrait;
}

type MetaMap = {
    [key: string]: ComponentMeta;
};

class Components {
    private static BUTTON_NAME: string = 'button';
    private static LIST_NAME: string = 'list';
    private static DYNAMIC_TEMPLATE_NAME: string = 'dynamicTemplate';

    private meta: MetaMap = {
        [Components.BUTTON_NAME]: require('./buttons/button.fr.json'),
        [Components.LIST_NAME]: require('./lists/list.fr.json'),
        [Components.DYNAMIC_TEMPLATE_NAME]: require('./text/dynamic-template.fr.json')
    };

    public getMeta(key: string): ComponentMeta {
        return this.meta[key];
    }
}

export default new Components();
