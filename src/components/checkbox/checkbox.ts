import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './checkbox.html?style=./checkbox.scss';
import { CHECKBOX_NAME } from '../component-names';

@WithRender
@Component
export class MCheckbox extends Vue {

    @Prop({ default: 'primary' })
    public aspect: string;
    @Prop({ default: false })
    public isChecked: boolean;
    @Prop({ default: 'left' })
    public position: string;

    public componentName: string = CHECKBOX_NAME;
    private propsIsChecked = true;

    public mounted(): void {
        this.propsIsChecked = this.$props.isChecked;
    }

    public get hasCheckboxLeft(): boolean {
        return this.$props['position'] == 'left';
    }
}

const CheckboxPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CHECKBOX_NAME, MCheckbox);
    }
};

export default CheckboxPlugin;
