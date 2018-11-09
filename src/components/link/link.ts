import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { LINK_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconPlugin from '../icon/icon';
import WithRender from './link.html?style=./link.scss';

export enum MLinkIconPosition {
    Left = 'left',
    Right = 'right'
}

export enum MLinkSkin {
    Default = 'default',
    Light = 'light',
    Text = 'text'
}

const ICON_NAME_DEFAULT: string = 'm-svg__chevron--right';

@WithRender
@Component
export class MLink extends ModulVue {
    @Prop()
    public url: string | Object;

    @Prop()
    public extern: boolean;

    @Prop()
    public disabled: boolean;

    @Prop()
    public unvisited: boolean;

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

    @Prop()
    public icon: boolean;

    @Prop()
    public iconName: string;

    @Prop({
        default: MLinkIconPosition.Left,
        validator: value =>
            value === MLinkIconPosition.Left || value === MLinkIconPosition.Right
    })
    public iconPosition: MLinkIconPosition;

    @Prop({ default: '12px' })
    public iconSize: string;

    @Prop({ default: 0 })
    public tabindex: number;

    private onClick(event): void {

        if (this.isButton || this.disabled) {
            event.preventDefault();
        }
        if (!this.disabled) {
            this.$emit('click', event);
            this.$el.blur();
        }
    }

    private get hasUrl(): boolean {
        return !!this.url && !this.disabled;
    }

    private get isRouterLink(): boolean {
        return this.hasUrl && !this.extern;
    }

    private get isButton(): boolean {
        return !this.hasUrl;
    }

    private get isExternalLink(): boolean {
        return this.hasUrl && this.extern;
    }

    private get buttonRole(): string | undefined {
        return this.isButton ? 'button' : undefined;
    }

    private get componentToShow(): string {
        if (this.isButton) {
            return 'span';
        } else if (this.isRouterLink) {
            return 'router-link';
        }
        return 'a';
    }

    private get routerLinkUrl(): string | Object | undefined {
        if (this.isRouterLink) {
            return !this.isObject(this.url) ? { path: this.url } : this.url;
        }
        return undefined;
    }

    private get href(): string | Object | undefined {
        return this.isExternalLink ? (this.isButton ? '#' : this.url) : undefined;
    }

    private get isSkinText(): boolean {
        return this.skin === MLinkSkin.Text;
    }

    private get isSkinLight(): boolean {
        return this.skin === MLinkSkin.Light;
    }

    private get isUnvisited(): boolean {
        return this.isButton ? true : this.unvisited;
    }

    private get isIconPositionLeft(): boolean {
        return this.hasIcon && this.iconPosition === MLinkIconPosition.Left;
    }

    private get isIconPositionRight(): boolean {
        return this.hasIcon && this.iconPosition === MLinkIconPosition.Right;
    }

    private get hasIcon(): boolean {
        return this.iconName !== undefined && this.iconName !== ''
            ? true
            : this.icon;
    }

    private get propIconName(): string {
        return this.iconName !== undefined && this.iconName !== ''
            ? this.iconName
            : ICON_NAME_DEFAULT;
    }

    private get isTargetBlank(): boolean {
        return this.propTarget === '_blank';
    }

    private get propTarget(): string | undefined {
        return this.isButton ? undefined : this.target;
    }

    private get propTabindex(): number {
        return this.disabled ? -1 : this.tabindex;
    }

    private isObject(a): boolean {
        return !!a && a.constructor === Object;
    }
}

const LinkPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(LINK_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.use(I18nPlugin);
        v.component(LINK_NAME, MLink);
    }
};

export default LinkPlugin;
