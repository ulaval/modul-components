import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { BACK_NAME } from '../component-names';
import WithRender from './back.html';

@WithRender
@Component
export class MBack extends ModulVue {
    @Prop()
    public url: string | Location;

    @Prop()
    public disabled: boolean;

    @Prop({ default: false })
    public underline: boolean;

    @Prop()
    public target: string;

    @Prop({ default: '16px' })
    public iconSize: string;

    @Prop({ default: 0 })
    public tabindex: number;

    private i18nBack: string = this.$i18n.translate('m-back:back');

    private onClick(event): void {
        if (!this.disabled) {
            this.$emit('click', event);
        }
    }

    private hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }
}

const BackPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(BACK_NAME, 'plugin.install');
        v.component(BACK_NAME, MBack);
    }
};

export default BackPlugin;
