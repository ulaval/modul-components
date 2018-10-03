import { ComponentAttributes, ComponentMeta } from '../meta';
import { MetaComponent, MetaProps, MetaV2 } from './meta-v2';

export class MetaV2Converter {

    constructor(private metaV2: MetaV2) { }

    /**
     * Extract a ComponentMeta from Meta-v2
     *
     * this will be used as a bridge to support legacy behavior of meta.ts.
     *
     * @param tagName
     */
    extractComponentMetaFromV2(tagName: string): ComponentMeta {
        let metaComponent: MetaComponent = this.metaV2.findMetaComponentByTagName(tagName);

        let componentMetaOutput: ComponentMeta = {
            tag: tagName,
            metaV2: metaComponent
        };

        // set attribute
        if (metaComponent.props) {
            componentMetaOutput.attributes = this.extractComponentAttributesFromMetaProp(metaComponent.props);

        }

        // set mixins
        if (metaComponent.mixins) {
            componentMetaOutput.mixins = [...metaComponent.mixins];
        }

        return componentMetaOutput;
    }

    private extractComponentAttributesFromMetaProp(metaProps: MetaProps[]): ComponentAttributes {

        let componentAttributesOuput: ComponentAttributes = {};

        metaProps.forEach((metaProps: MetaProps) => {
            componentAttributesOuput[metaProps.name] = {
                type: metaProps.type,
                values: []
            };

            if (metaProps.values) {
                componentAttributesOuput[metaProps.name].values = [...metaProps.values];
            }

            componentAttributesOuput[metaProps.name].optional = metaProps.optional;

            if (metaProps.default) {
                componentAttributesOuput[metaProps.name].defaultValue = metaProps.default;
            }
        });

        return componentAttributesOuput;
    }
}
