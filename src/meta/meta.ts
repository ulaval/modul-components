import Vue from 'vue';
import { components } from '../components/component-names';
import { directives } from '../directives/directive-names';

export type OverviewType = 'rubric' | 'do' | 'dont';

export interface Overview {
    type: OverviewType;
    title: string;
    content: string;
}

export interface ComponentAttribute {
    type: string;
    description: string;
    values: string[];
    default?: number;
}

export interface ComponentAttributes {
    [attribute: string]: ComponentAttribute;
}

export interface ComponentMeta {
    tag: string;
    name?: string;
    attributes?: ComponentAttributes;
    overview?: Overview[];
}

export type ComponentMetaMap = {
    [key: string]: ComponentMeta;
};

type MetaMap = {
    [language: string]: ComponentMetaMap;
};

export class Meta {
    private componentMeta: MetaMap = {
        ['fr']: {}
    };

    constructor() {
        components.forEach(componentTag => {
            this.componentMeta['fr'][componentTag] = {tag: componentTag};
        });

        directives.forEach(directiveTag => {
            this.componentMeta['fr'][directiveTag] = {tag: directiveTag};
        });
    }

    public mergeComponentMeta(language: string, tag: string, meta: ComponentMeta): void {
        let metaObject: ComponentMeta = this.componentMeta[language][tag];
        this.componentMeta[language][tag] = {...metaObject, ...meta};
    }

    public getTagsByLanguage(language: string): string[] {
        let meta: ComponentMetaMap = this.componentMeta[language];
        return Object.keys(meta).filter(key => meta.hasOwnProperty(key));
    }

    public getMetaByLanguageAndTag(language: string, tag: string): ComponentMeta {
        return this.componentMeta[language][tag];
    }

    public getComponentAttributes(componentMeta: ComponentMeta): string[] {
        if (componentMeta.attributes) {
            return Object.keys(componentMeta.attributes).filter(key => componentMeta.attributes && componentMeta.attributes.hasOwnProperty(key));
        } else {
            return [];
        }
    }
}

export default new Meta();
