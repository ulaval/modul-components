import { ModulVue } from '../../utils/vue/vue';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './limit-text.html?style=./limit-text.scss';
import { LIMIT_TEXT_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import LinkPlugin from '../link/link';

@WithRender
@Component
export class MLimitText extends ModulVue {

    @Prop()
    public open: boolean;

    @Prop({ default: 4 })
    public lines: number;

    @Prop()
    public openLabel: string;

    @Prop()
    public closeLabel: string;

    private openHiddenText: string = this.$i18n.translate('m-limit-text:open');
    private closeHiddenText: string = this.$i18n.translate('m-limit-text:close');
    private internalOpen: boolean = false;
    private contentHeight: number = 0;
    private maxHeight: number = 0;
    private overflow: boolean = false;

    protected mounted(): void {
        Vue.nextTick(() => {
            this.computeHeight();
        });
    }

    protected updated(): void {
        this.computeHeight();
    }

    private computeHeight(): void {
        this.contentHeight = (this.$refs.container as HTMLElement).scrollHeight;
        this.maxHeight = (this.$refs.test as HTMLElement).clientHeight * this.lines;
        this.overflow = this.contentHeight > this.maxHeight;
    }

    private get maxHeightStyle(): string | undefined {
        if (this.overflow) {
            return this.propOpen ? this.contentHeight + 'px' : this.maxHeight + 'px';
        }
        return 'none';
    }

    private get propOpen() {
        if (this.open !== undefined) {
            return this.open;
        }
        return this.internalOpen;
    }

    private onOpen(): void {
        this.internalOpen = true;
        this.$emit('update:open', true);
    }

    private onClose(): void {
        this.internalOpen = false;
        this.$emit('update:open', false);
    }

    private get openText() {
        return `[ ${this.openLabel || this.openHiddenText} ]`;
    }

    private get closeText() {
        return `[ ${this.closeLabel || this.closeHiddenText} ]`;
    }
}

const LimitTextPlugin: PluginObject<any> = {
    install(v, options): void {
        console.warn(LIMIT_TEXT_NAME + ' is not ready for production');
        v.use(I18nPlugin);
        v.use(LinkPlugin);
        v.component(LIMIT_TEXT_NAME, MLimitText);
    }
};

export default LimitTextPlugin;
