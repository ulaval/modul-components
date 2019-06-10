import 'flag-icon-css/css/flag-icon.min.css';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { FLAG_NAME } from '../component-names';
import WithRender from './flag.html';

@WithRender
@Component
export class MFlag extends ModulVue {
    @Prop({ required: true })
    public iso: string;

    @Prop()
    public title: boolean;

    @Prop()
    public squared: boolean;

    public get flagIconClass(): string {
        return ((!!this.squared) ? 'flag-icon-squared ' : '') + 'flag-icon-' + this.iso.toLowerCase();
    }

}

const FlagPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(FLAG_NAME, MFlag);
    }
};

export default FlagPlugin;
