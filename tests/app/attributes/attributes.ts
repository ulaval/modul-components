import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './attributes.html';
import Meta, { ComponentMeta, ComponentAttributes } from '../../../src/meta/meta';
import { FRENCH } from '../../../src/utils/i18n';

interface AttributeMap {
    [attribute: string]: string[];
}

@WithRender
@Component
export class Attributes extends Vue {
    public allMeta: ComponentMeta[] = [];
    public attributeMap: AttributeMap = {};

    public mounted(): void {
        let meta: ComponentMeta[] = [];
        let map: AttributeMap = {};
        Meta.getTagsByLanguage(FRENCH).forEach(tag => {
            let componentMeta: ComponentMeta = Meta.getMetaByLanguageAndTag(FRENCH, tag);
            meta.push(componentMeta);

            this.getAttributes(componentMeta).forEach(attribute => {
                let tagMap: string[] = map[attribute];
                if (!tagMap) {
                    tagMap = [];
                }
                tagMap.push(tag);
                map[attribute] = tagMap;
            });
        });
        this.allMeta = meta;
        this.attributeMap = map;
    }

    public getAttributes(componentMeta: ComponentMeta): string[] {
        return Meta.getComponentAttributes(componentMeta);
    }

    public getAllAttributes(): string[] {
        return Object.keys(this.attributeMap).filter(key => this.attributeMap.hasOwnProperty(key));
    }
}
