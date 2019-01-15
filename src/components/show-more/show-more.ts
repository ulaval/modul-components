import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { MButtonSkin } from '../button/button';
import { SHOW_MORE_NAME } from '../component-names';
import WithRender from './show-more.html?style=./show-more.scss';

@WithRender
@Component
export class MShowMore extends ModulVue {
    @Prop({ default: 0 })
    nbVisible: number;

    @Prop({ required: true })
    nbTotal: number;

    @Prop({ default: false })
    loading: boolean;

    get isVisible(): boolean {
        return this.nbTotal !== undefined && this.nbTotal > 0;
    }

    get status(): string {
        return this.$i18n.translate('m-show-more:status', { nbVisible: this.nbVisible, nbTotal: this.nbTotal }, undefined, undefined, undefined, FormatMode.Sprintf);
    }

    get visiblePourcentage(): number {
        return (this.nbVisible / this.nbTotal) * 100;
    }

    get buttonLabel(): string {
        return this.$i18n.translate('m-show-more:button-label');
    }

    get buttonSkin(): string {
        return MButtonSkin.Secondary;
    }

    get isButtonVisible(): boolean {
        return this.nbVisible < this.nbTotal;
    }

    @Emit('click')
    showMore(): void {
        this.$emit('update:loading', true);
    }
}

const ShowMorePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(SHOW_MORE_NAME, 'plugin.install');
        v.component(SHOW_MORE_NAME, MShowMore);
    }
};

export default ShowMorePlugin;
