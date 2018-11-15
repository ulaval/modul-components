import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { ADD_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconPlugin from '../icon/icon';
import { MLinkIconPosition, MLinkSkin } from '../link/link';
import WithRender from './add.html?style=./add.scss';

@WithRender
@Component
export class MAdd extends ModulVue {
    @Prop()
    public url: string | Location;

    @Prop()
    public disabled: boolean;

    @Prop({ default: true })
    public underline: boolean;

    @Prop({
        default: MLinkSkin.Default,
        validator: value =>
            value === MLinkSkin.Default ||
            value === MLinkSkin.Light ||
            value === MLinkSkin.Text
    })
    public skin: MLinkSkin;

    @Prop()
    public target: string;

    @Prop({
        default: MLinkIconPosition.Left,
        validator: value =>
            value === MLinkIconPosition.Left || value === MLinkIconPosition.Right
    })
    public iconPosition: MLinkIconPosition;

    @Prop({ default: '24px' })
    public iconSize: string;

    @Prop({ default: 0 })
    public tabindex: number;

    private onClick(event): void {
        if (!this.disabled) {
            this.$emit('click', event);
        }
    }
}

const AddPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ADD_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.use(I18nPlugin);
        v.component(ADD_NAME, MAdd);
    }
};

export default AddPlugin;
