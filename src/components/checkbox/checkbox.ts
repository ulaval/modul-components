import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './checkbox.html?style=./checkbox.scss';
import { CHECKBOX_NAME } from '../component-names';
import uuid from '../../utils/uuid';

const POSITION_LEFT: string = 'left';

@WithRender
@Component
export class MCheckbox extends Vue {

    @Prop({ default: false })
    public isChecked: boolean;
    @Prop({ default: POSITION_LEFT })
    public position: string;
    @Prop({ default: true })
    public hasLabel: boolean;

    public componentName: string = CHECKBOX_NAME;
    private propsIsChecked = true;
    private propsHasLabel = true;
    private isFocus = false;
    private id: string = `checkbox${uuid.generate()}`;

    public mounted(): void {
        this.propsIsChecked = this.isChecked;
        this.propsHasLabel = this.hasLabel;
    }

    private onClick(event): void {
        this.$emit('click');
        this.$refs['checkbox']['blur']();
    }

    public get hasCheckboxLeft(): boolean {
        return this.$props['position'] == POSITION_LEFT;
    }
}

const CheckboxPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CHECKBOX_NAME, MCheckbox);
    }
};

export default CheckboxPlugin;
