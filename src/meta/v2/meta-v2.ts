export interface Meta {
    modulVersion?: string;
    components: MetaComponent[];
}

export interface MetaComponent {
    componentName: string;
    props?: MetaProps[];
    events?: MetaEvent[];
    mixins?: string[];
    slots?: MetaSlot[];
}
export interface MetaArgument {
    name: string;
    type: string;
}

export interface MetaEvent {
    name: string;
    arguments?: MetaArgument[];
}

export interface MetaProps {
    name: string;
    optional: boolean;
    type: string;
    values?: string[];
    default?: string;
}

export interface MetaSlot {
    name?: string;
    isDefault: boolean;
}

export class MetaV2 {
    constructor(private _meta: Meta) { }

    get meta(): Meta {
        return this._meta;
    }

    findMetaComponentByComponentName(componentName: string): MetaComponent {

        let component: any = this._meta.components.find((metaComponent: MetaComponent) => {
            return metaComponent.componentName.toLowerCase() === componentName.toLowerCase();
        });
        if (component) {
            return component as MetaComponent;
        }
        throw new Error(`Unable to find component with name ${componentName} in meta`);
    }

    findMetaComponentByTagName(tagName: string): MetaComponent {

        // a tag name is in Pascal case
        let component: any = this._meta.components.find((metaComponent: MetaComponent) => {
            return this.camelToKebab(metaComponent.componentName) === tagName;
        });
        if (component) {
            return component as MetaComponent;
        }
        throw new Error(`Unable to find component with tagName ${tagName} in meta`);
    }

    private camelToKebab(camelString: string): string {
        return camelString.replace(/([a-zA-Z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

}
