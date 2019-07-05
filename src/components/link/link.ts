import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Location } from 'vue-router';
import { KeyCode } from '../../utils/keycode/keycode';
import { ModulVue } from '../../utils/vue/vue';
import { LINK_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconPlugin from '../icon/icon';
import WithRender from './link.html?style=./link.scss';

export enum MLinkMode {
    RouterLink = 'router-link',
    Link = 'link',
    Button = 'button'
}

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
    @Prop({ default: '/' })
    public url: string | Location;

    @Prop({
        default: MLinkMode.RouterLink,
        validator: value =>
            value === MLinkMode.RouterLink ||
            value === MLinkMode.Link ||
            value === MLinkMode.Button
    })
    public mode: MLinkMode;

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

    @Prop({ default: '0' })
    public tabindex: string;

    protected mounted(): void {
        this.isButtonChanged(this.mode === MLinkMode.Button);
    }

    @Watch('isButton')
    private isButtonChanged(isButton: boolean): void {
        if (isButton) {
            this.$nextTick(() => {
                this.$el.setAttribute('role', 'button');
            });
        } else {
            this.$nextTick(() => {
                if (this.$el.hasAttribute('role')) {
                    this.$el.removeAttribute('role');
                }
            });
        }
    }

    private onClick(event): void {
        (this.$el as HTMLElement).blur();
        if (this.isButton || this.disabled) {
            event.preventDefault();
        }
        if (!this.disabled) {
            this.$emit('click', event);
        }
    }

    private get isRouterLink(): boolean {
        return this.mode === MLinkMode.RouterLink;
    }

    private onKeyup(event): void {
        event = event || window.event;
        if (event.keyCode === KeyCode.M_SPACE && this.isButton) {
            this.onClick(event);
        }
    }

    private get isButton(): boolean {
        return this.mode === MLinkMode.Button;
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

    private get propUrl(): string | undefined {
        return this.isButton
            ? '#'
            : !this.disabled ? this.url as string : undefined;
    }

    private get isTargetBlank(): boolean {
        return this.target === '_blank';
    }

    private get routerLinkUrl(): string | Location {
        return this.isObject(this.url) ? this.url as Location : { path: this.url as string };
    }

    private get routerEvent(): string {
        return this.disabled ? '' : 'click';
    }

    private isObject(a): boolean {
        return !!a && a.constructor === Object;
    }

}

const LinkPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconPlugin);
        v.use(I18nPlugin);
        v.component(LINK_NAME, MLink);
    }
};

export default LinkPlugin;
