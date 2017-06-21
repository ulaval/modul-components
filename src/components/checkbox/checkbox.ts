import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './checkbox.html?style=./checkbox.scss';
import { CHECKBOX_NAME } from '../component-names';

declare module 'vue/types/vue' {
    interface Vue {
        _uid: number;
    }
}

@WithRender
@Component({
    data() {
        return {
            id: 'checkbox' + this._uid
        };
    }
})
export class MCheckbox extends Vue {

    @Prop({ default: false })
    public isChecked: boolean;
    @Prop({ default: 'left' })
    public position: string;
    @Prop({ default: true })
    public hasLabel: boolean;

    public componentName: string = CHECKBOX_NAME;
    private propsIsChecked = true;
    private propsHasLabel = true;
    private isFocus = false;

    public mounted(): void {
        this.propsIsChecked = this.isChecked;
        this.propsHasLabel = this.hasLabel;
    }

    private onClick(event): void {
        this.$emit('onClick');
        this.$refs['checkbox']['blur']();
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
