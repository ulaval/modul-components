import Vue, { PluginObject, VNode, VNodeComponentOptions } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { toKebabCase } from '../utils/str/str';
import { ModulVue } from '../utils/vue/vue';
import WithRender from './dynamic-sandbox.html';

@WithRender
@Component
export class MDynamicSandbox extends ModulVue {
    @Prop()
    public tag: string | undefined;

    public showSandbox: boolean = false;
    public meta: any = {};
    public data: any = {};

    protected hasErrors: boolean = false;

    protected mounted(): void {
        if (this.hasSpecificTemplate() && !this.hasTagProp()) {
            const defaultSlot: VNode = this.$slots.default ? this.$slots.default[0] : this.$scopedSlots.default(this.data) as any;
            const componentOptions: VNodeComponentOptions | undefined = defaultSlot.componentOptions;
            const componentTag: string = componentOptions && componentOptions.tag ? componentOptions.tag : '';

            this.buildDynamicSandbox(componentTag);
            this.fillSlots(componentTag);
        } else if (this.hasTagProp() && !this.hasSpecificTemplate()) {
            this.buildDynamicSandbox(this.tag as string);
            this.fillSlots(this.tag);
        } else {
            this.hasErrors = true;
            console.error('dynamic-sandbox expected a slot of length 1 of type ModulVue OR a defined tag property.');
        }
    }

    protected assignArrayProp(propName: string, value: string): void {
        this.data[propName] = value.split(',').map(value => {
            value = value.replace(',', '');
            value = value.trim();
            return value;
        });
    }

    private hasSpecificTemplate(): boolean {
        if (!Object.keys(this.$slots).length && !Object.keys(this.$scopedSlots).length) { return false; }

        const defaultSlot: VNode = Object.keys(this.$slots).length ? this.$slots.default[0] : this.$scopedSlots.default(this.data) as any;
        const componentOptions: VNodeComponentOptions | undefined = defaultSlot.componentOptions;
        const componentTag: string = componentOptions && componentOptions.tag ? componentOptions.tag : '';

        return defaultSlot && componentOptions !== undefined && componentTag.includes('m-');
    }

    private hasTagProp(): boolean { return this.tag !== undefined; }

    private buildDynamicSandbox(tag: string): void {
        const componentName: string = tag.replace('m-', '');
        this.meta = require(`../../dist/components/${componentName}/${componentName}.meta.json`);

        if (this.meta.mixins) {
            const mixins: any[] = this.meta.mixins.map(mixin => {
                const mixinName: string = toKebabCase(mixin);
                return require(`../../dist/mixins/${mixinName}/${mixinName}.meta.json`);
            });

            mixins.forEach(mixin => {
                this.meta.attributes = Object.assign(this.meta.attributes, mixin.attributes);
                this.meta.enums = Object.assign(this.meta.enums, mixin.enums);
            });
            delete this.meta.mixins;
        }

        const testComponentVue: Vue = this.getTestComponentVue();
        Object.keys(this.meta.attributes).forEach(key => {
            this.$set(this.data, key, testComponentVue[key]);
        });
    }

    private fillSlots(tag): void {
        const componentName: string = tag.replace('m-', '');
        const testComponentTemplate: string = require(`!html-loader!../../dist/components/${componentName}/${componentName}.html`);
        const testComponentVue: Vue = this.getTestComponentVue();

        const slotRegex: RegExp = /<slot(?: name=")?([a-zA-Z]*)"?>/g;
        let match: RegExpExecArray | null = slotRegex.exec(testComponentTemplate);
        while (match) {
            const slotName: string = match[1] || 'default';
            if (!testComponentVue.$slots[slotName]) {
                testComponentVue.$slots[slotName] = [this.$createElement('div', `slot ${slotName}`)];
            }
            match = slotRegex.exec(testComponentTemplate);
        }
        testComponentVue.$forceUpdate();
    }

    private getTestComponentVue(): Vue {
        return (this.$el.children[0] as any).__vue__ as Vue;
    }
}

const DynamicSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.component('dynamic-sandbox', MDynamicSandbox);
    }
};

export default DynamicSandboxPlugin;
