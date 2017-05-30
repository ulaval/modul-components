import Vue from 'vue';
import { components } from './component-names';

export type OverviewType = 'rubric' | 'do' | 'dont';

export const BUTTONS_LIB: string = 'Buttons';
export const LISTS_LIB: string = 'Lists';
export const TEXT_LIB: string = 'Text';

export interface Overview {
    type: OverviewType;
    title: string;
    content: string;
}

export interface ComponentMeta {
    tag: string;
    name?: string;
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
}

export default new Meta();
