import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { ADD_NAME } from '../component-names';
import { MLinkIconPosition, MLinkSkin } from '../link/link';
import WithRender from './add.html';
import './add.scss';

@WithRender
@Component
export class MAdd extends ModulVue {
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

    @Prop({
        default: MLinkIconPosition.Left,
        validator: value =>
            value === MLinkIconPosition.Left || value === MLinkIconPosition.Right
    })
    public iconPosition: MLinkIconPosition;

    @Prop({ default: '24px' })
    public iconSize: string;

    @Emit('click')
    public emitClick(): void { }

    private onClick(): void {
        if (this.disabled) {
            return;
        }

        this.emitClick();
    }
}

const AddPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ADD_NAME, 'plugin.install');
        v.component(ADD_NAME, MAdd);
    }
};

export default AddPlugin;
