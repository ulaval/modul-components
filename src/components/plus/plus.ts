import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { PLUS_NAME } from '../component-names';
import WithRender from './plus.html?style=./plus.scss';

export enum MPlusSkin {
    Default = 'default',
    Light = 'light'
}

@WithRender
@Component
export class MPlus extends ModulVue {

    @Prop()
    public open: boolean;

    @Prop()
    public large: boolean;

    @Prop()
    public border: boolean;

    @Prop({
        default: MPlusSkin.Default,
        validator: value =>
            value === MPlusSkin.Default ||
            value === MPlusSkin.Light
    })
    public skin: string;

    @Prop()
    public disabled: boolean;

    private onClick(event: Event): void {
        if (!this.disabled) {
            this.$emit('click', event);
        }
    }

    private get skinLight(): boolean {
        return this.skin === MPlusSkin.Light;
    }
}

const PlusPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(PLUS_NAME, 'plugin.install');
        v.component(PLUS_NAME, MPlus);
    }
};

export default PlusPlugin;
