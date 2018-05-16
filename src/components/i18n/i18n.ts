import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { I18N_NAME } from '../component-names';
import WithRender from './i18n.html';

@WithRender
@Component
export class MI18n extends ModulVue {
    @Prop()
    public k: string;
    @Prop({ default: () => [] })
    public params: any;
    @Prop()
    public nb?: number;
    @Prop()
    public modifier: string;
    @Prop({ default: true })
    public htmlEncode: boolean;

    protected created(): void {
        if (!this.$i18n) {
            throw new Error('<' + I18N_NAME + '>: this.$i18n is undefined, you must register the i18n plugin.');
        }
    }

    private get text(): string {
        let result: string = '';
        if (this.k) {
            result = this.$i18n.translate(
                this.k,
                this.params,
                this.nb,
                this.modifier,
                this.htmlEncode
            );
        }

        return result;
    }
}

const I18nPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(I18N_NAME, 'plugin.install');
        v.component(I18N_NAME, MI18n);
    }
};

export default I18nPlugin;
