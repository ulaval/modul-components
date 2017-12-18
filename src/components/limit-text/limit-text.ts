import { ModulVue } from '../../utils/vue/vue';
import Vue, { PluginObject, VNode, CreateElement, VNodeComponentOptions, ComponentOptions } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './limit-text.html?style=./limit-text.scss';
import { LIMIT_TEXT_NAME } from '../component-names';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MLimitText extends ModulVue {
    @Prop({ default: 4 })
    public lines: number;

    @Prop({ default: '\xa0+\xa0' })
    public openLabel: string;

    @Prop({ default: '\xa0-\xa0' })
    public closeLabel: string;

    @Prop()
    public open: boolean;

    private internalPropOpen: boolean = false;
    private contentHeight: number = 0;
    private maxHeight: number = 0;

    protected mounted() {
        this.computeHeight();
    }

    protected updated() {
        this.computeHeight();
    }

    private computeHeight() {
        this.contentHeight = (this.$refs.container as HTMLElement).clientHeight;
        let lineHeight = window.getComputedStyle(this.$refs.container as HTMLElement).getPropertyValue('line-height');
        this.maxHeight = parseFloat(lineHeight) * this.lines;
    }

    private get overflow(): number {
        return this.lines ? Math.max(this.contentHeight - this.maxHeight, 0) : 0;
    }

    private get style() {
        if (this.overflow && !this.propOpen) {
            return this.maxHeight + 'px';
        }
        return 'none';
    }

    private get propOpen() {
        if (this.open !== undefined) {
            return this.open;
        }
        return this.internalPropOpen;
    }

    private get openHiddenText(): string {
        return this.$i18n.translate('m-limit-text:open');
    }

    private get openLinkText() {
        return '[' + this.openLabel.replace(/\s/g, '\xa0') + ']';
    }

    private get closeHiddenText(): string {
        return this.$i18n.translate('m-limit-text:close');
    }

    private get closeLinkText() {
        return '[' + this.closeLabel.replace(/\s/g, '\xa0') + ']';
    }

    private onOpen() {
        this.internalPropOpen = true;
        this.$emit('update:open', true);
    }

    private onClose() {
        this.internalPropOpen = false;
        this.$emit('update:open', false);
    }
}

const LimitTextPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(LIMIT_TEXT_NAME, MLimitText);
    }
};

export default LimitTextPlugin;
