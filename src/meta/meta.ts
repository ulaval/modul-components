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

export interface ComponentMethodArgument {
    name: string;
    type: string;
    description: string;
}

export interface ComponentMethodReturn {
    type: string;
    description: string;
}

export interface ComponentMethod {
    description: string;
    arguments: ComponentMethodArgument[];
    return?: ComponentMethodReturn;
}

export interface ComponentAttributes {
    [attribute: string]: ComponentAttribute;
}

export interface ComponentMethods {
    [method: string]: ComponentMethod;
}

export interface ComponentMeta {
    tag: string;
    name?: string;
    attributes?: ComponentAttributes;
    methods?: ComponentMethods;
    overview?: Overview[];
}

export type ComponentMetaMap = {
    [key: string]: ComponentMeta;
};

export class Meta {
    private componentMeta: ComponentMetaMap = {};

    constructor() {
        components.forEach(componentTag => {
            this.componentMeta[componentTag] = {tag: componentTag};
        });

        directives.forEach(directiveTag => {
            this.componentMeta[directiveTag] = {tag: directiveTag};
        });
    }

    public mergeComponentMeta(tag: string, meta: ComponentMeta): void {
        let metaObject: ComponentMeta = this.componentMeta[tag];
        this.componentMeta[tag] = {...metaObject, ...meta};
    }

    public getTags(): string[] {
        return Object.keys(this.componentMeta).filter(key => this.componentMeta.hasOwnProperty(key));
    }

    public getMetaByTag(tag: string): ComponentMeta {
        return this.componentMeta[tag];
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
