import Vue, { VNode, VNodeComponentOptions } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from './../../../src/utils/vue/vue';
import WithRender from './dynamic-sandbox.html';

@WithRender
@Component
export class DynamicSandbox extends ModulVue {
    @Prop()
    public ignoreProps: string[];

    public showSandbox: boolean = false;
    public meta: any = {};
    public data: any = {};

    protected mounted(): void {
        const defaultSlot: VNode = this.$slots.default ? this.$slots.default[0] : this.$scopedSlots.default(this.data) as any;
        const componentOptions: VNodeComponentOptions | undefined = defaultSlot.componentOptions;
        const componentTag: string = componentOptions && componentOptions.tag ? componentOptions.tag : '';

        if (defaultSlot && componentOptions !== undefined && componentTag.includes('m-')) {
            componentOptions.propsData = { disabled: false };
            this.buildDynamicSandbox(componentTag);
            this.showSandbox = true;
        } else {
            console.error('dynamic-sandbox expected a slot of length 1 of type ModulVue.');
        }
    }

    private buildDynamicSandbox(tag: string): void {
        const componentName: string = tag.replace('m-', '');
        this.meta = require(`../../../dist/components/${componentName}/${componentName}.meta.json`);
        if (this.meta.mixins) {
            const mixins: any[] = this.meta.mixins.map(mixin => {
                return require(`../../../dist/mixins/${this.toKebabCase(mixin)}/${this.toKebabCase(mixin)}.meta.json`);
            });

            mixins.forEach(mixin => {
                this.meta.attributes = Object.assign(this.meta.attributes, mixin.attributes);
                this.meta.enums = Object.assign(this.meta.enums, mixin.enums);
            });
            delete this.meta.mixins;
        }

        const testComponentVue: Vue = (this.$el.children[0] as any).__vue__ as Vue;
        Object.keys(this.meta.attributes).forEach(key => {
            this.$set(this.data, key, testComponentVue[key]);
        });
    }

    private toKebabCase(param: string): string {
        const upperChars: RegExpMatchArray | null = param.match(/([A-Z])/g);
        if (!upperChars) {
            return param;
        }

        let str: string = param.toString();
        for (let i: number = 0; i < upperChars.length; i++) {
            str = str.replace(new RegExp(upperChars[i]), '-' + upperChars[i].toLowerCase());
        }

        if (str.slice(0, 1) === '-') {
            str = str.slice(1);
        }

        return str;
    }
}
