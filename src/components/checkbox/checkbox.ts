import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './checkbox.html?style=./checkbox.scss';
import { CHECKBOX_NAME } from '../component-names';
import uuid from '../../utils/uuid/uuid';

const POSITION_LEFT: string = 'left';

@WithRender
@Component
export class MCheckbox extends Vue {

    @Prop({ default: false })
    public checked: boolean;
    @Prop({ default: POSITION_LEFT })
    public position: string;
    @Prop({ default: true })
    public label: boolean;

    public componentName: string = CHECKBOX_NAME;
    private propChecked = true;
    private propLabel = true;
    private isFocus = false;
    private id: string = `mCheckbox-${uuid.generate()}`;

    public mounted(): void {
        this.propChecked = this.checked;
        this.propLabel = this.label;
    }

    private onClick(event): void {
        this.$emit('click');
        this.$refs['checkbox']['blur']();
    }

    public get hasCheckboxLeft(): boolean {
        return this.position == POSITION_LEFT;
    }
}

const CheckboxPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(CHECKBOX_NAME, MCheckbox);
    }
};

export default CheckboxPlugin;
