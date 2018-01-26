import Vue from 'vue';
import { components } from '../components/component-names';
import { directives } from '../directives/directive-names';
import { mixins } from '../mixins/mixins-names';

// export type OverviewType = 'rubric' | 'do' | 'dont';

export type Preview = string | boolean;

// export interface Overview {
//     type: OverviewType;
//     title: string;
//     content: string;
// }

export interface ComponentAttribute {
    type: string;
    // description: string;
    values: string[];
    default?: number;
    origin?: ComponentMeta;
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
    metaKey?: string; //
    folder?: string; //
    name?: string; //
    attributes?: ComponentAttributes;
    mixins?: string[];
    production?: boolean; //
    methods?: ComponentMethods;
    overview?: string; //
    category?: string; //
    preview?: Preview; //
}

export type ComponentMetaMap = {
    [key: string]: ComponentMeta;
};

export type CategoryComponentMap = {
    [key: string]: ComponentMeta[];
};

// export type ComponentAttributeFn = (attribute: string, meta: ComponentMeta) => void;

export class Meta {
    private componentMeta: ComponentMetaMap = {};
    private categories: CategoryComponentMap = {};

    constructor() {
        components.forEach(componentTag => {
            this.componentMeta[componentTag] = { tag: componentTag };
        });

        directives.forEach(directiveTag => {
            this.componentMeta[directiveTag] = { tag: directiveTag };
        });

        mixins.forEach(mixinTag => {
            this.componentMeta[mixinTag] = { tag: mixinTag }; // TODO: folder will have to be added to provide mixin documentation (markdown files)
        });
    }

    public mergeComponentMeta(tag: string, meta: ComponentMeta, category?: string): ComponentMeta {
        let metaObject: ComponentMeta = this.componentMeta[tag];
        let mergedMeta: ComponentMeta = { ...metaObject, ...meta };
        this.componentMeta[tag] = mergedMeta;

        // mergedMeta.name = mergedMeta.tag + '-meta:name';
        // mergedMeta.overview = mergedMeta.overview

        // if (mergedMeta.preview === undefined) {
        //     mergedMeta.preview = true;
        // }

        if (category) {
            let categoryComponents: ComponentMeta[] = this.categories[category];
            if (!categoryComponents) {
                categoryComponents = [];
                this.categories[category] = categoryComponents;
            }
            mergedMeta.category = category;
            categoryComponents.push(mergedMeta);
        }

        if (mergedMeta.mixins) {
            mergedMeta.mixins.forEach(mixin => {
                this.mergeComponentAttributes(mergedMeta, mixin);
            });
        }

        return mergedMeta;
    }

    // TODO: eval usage
    public getMeta(): ComponentMeta[] {
        let result: ComponentMeta[] = [];
        Object.keys(this.componentMeta).filter(key => this.componentMeta.hasOwnProperty(key)).forEach(key => {
            let meta: ComponentMeta = this.componentMeta[key];
            if (process.env && (process.env.NODE_ENV as any).dev || meta.production === true) {
                result.push(meta);
            }
        });
        return result;
    }

    public getTags(): string[] {
        return Object.keys(this.componentMeta).filter(key => this.componentMeta.hasOwnProperty(key));
    }

    public getCategories(): string[] {
        let categories: string[] = Object.keys(this.categories).filter(key => this.categories.hasOwnProperty(key));
        if (!(process.env && (process.env.NODE_ENV as any).dev)) {
            categories = categories.filter(category => this.categories[category].some(component => component.production === true));
        }
        return categories;
    }

    public getMetaByTag(tag: string): ComponentMeta {
        return this.componentMeta[tag];
    }

    public getMetaByCategory(category: string): ComponentMeta[] {
        return process.env && (process.env.NODE_ENV as any).dev ? this.categories[category] :
            this.categories[category].filter(component => component.production === true);
    }

    public getComponentAttributes(componentMeta: ComponentMeta): string[] {
        if (componentMeta.attributes) {
            return Object.keys(componentMeta.attributes).filter(key => componentMeta.attributes && componentMeta.attributes.hasOwnProperty(key));
        } else {
            return [];
        }
    }

    private mergeComponentAttributes(componentMeta: ComponentMeta, mixin: string): void {
        let mixinMeta: ComponentMeta = this.getMetaByTag(mixin);
        if (mixinMeta.attributes) {
            Object.keys(mixinMeta.attributes)
                .filter(key => mixinMeta.attributes && mixinMeta.attributes.hasOwnProperty(key))
                .forEach(attribute => {
                    if (mixinMeta.attributes) {
                        mixinMeta.attributes[attribute].origin = mixinMeta;
                    }
                });
            componentMeta.attributes = { ...componentMeta.attributes, ...mixinMeta.attributes };
            if (mixinMeta.mixins) {
                mixinMeta.mixins.forEach(mixin => {
                    this.mergeComponentAttributes(componentMeta, mixin);
                });
            }
        }
    }
}

export default new Meta();
