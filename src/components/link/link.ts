import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
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

const ICON_NAME_CHEVRON: string = 'm-svg__chevron--right';

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
    public bulletPoint: boolean;

    @Prop()
    public iconName: string;

    @Prop({
        default: MLinkIconPosition.Left,
        validator: value =>
            value === MLinkIconPosition.Left || value === MLinkIconPosition.Right
    })
    public iconPosition: MLinkIconPosition;

    @Prop({ default: '1em' })
    public iconSize: string;

    @Prop({ default: '0' })
    public tabindex: string;

    @Emit('click')
    private emitClick(event: Event): void { }

    public get isRouterLink(): boolean {
        return this.mode === MLinkMode.RouterLink;
    }

    public get roleButton(): string | undefined {
        return this.isButton ? 'button' : undefined;
    }

    public get iconHasLargeStroke(): boolean {
        switch (this.propIconName) {
            case 'm-svg__chevron--up':
            case 'm-svg__chevron--right':
            case 'm-svg__chevron--down':
            case 'm-svg__chevron--left':
                return true;
            default:
                return false;
        }
    }

    public get linkRef(): string {
        return this.isRouterLink ? 'router' : 'link';
    }

    public get isButton(): boolean {
        return this.mode === MLinkMode.Button;
    }

    public get isSkinText(): boolean {
        return this.skin === MLinkSkin.Text;
    }

    public get isSkinLight(): boolean {
        return this.skin === MLinkSkin.Light;
    }

    public get isUnvisited(): boolean {
        return this.isButton ? true : this.unvisited;
    }

    public get isIconPositionLeft(): boolean {
        return this.hasIcon && this.iconPosition === MLinkIconPosition.Left;
    }

    public get isIconPositionRight(): boolean {
        return this.hasIcon && this.iconPosition === MLinkIconPosition.Right;
    }

    public get hasIcon(): boolean {
        return Boolean(this.propIconName) || this.bulletPoint;
    }

    public get propIconSize(): string {
        return this.bulletPoint ? '12px' : this.iconSize;
    }

    public get propIconName(): string {
        return this.bulletPoint ? ICON_NAME_CHEVRON : this.iconName;
    }

    public get propUrl(): string | undefined {
        switch (this.mode) {
            case MLinkMode.Link:
                return !this.disabled ? this.url as string : undefined;
            case MLinkMode.Button:
                return '#';
            case MLinkMode.RouterLink:
            default:
                return undefined;
        }
    }

    public get routerLinkUrl(): Location | undefined {
        switch (this.mode) {
            case MLinkMode.Link:
            case MLinkMode.Button:
                return undefined;
            case MLinkMode.RouterLink:
            default:
                if (this.disabled || !this.url) {
                    return { path: '/' };
                } else {
                    return this.isObject(this.url) ? this.url as Location : { path: this.url as string };
                }
        }
    }

    public get isTargetBlank(): boolean {
        return this.target === '_blank';
    }

    public get routerEvent(): string | undefined {
        if (!this.isRouterLink) {
            return undefined;
        }
        return this.disabled ? '' : 'click';
    }

    public get tagName(): string {
        return this.isRouterLink ? 'router-link' : 'a';
    }

    private isObject(a): boolean {
        return !!a && a.constructor === Object;
    }

    public onClick(event): void {
        (this.$el as HTMLElement).blur();
        if (this.isButton || this.disabled) {
            event.preventDefault();
        }
        if (!this.disabled) {
            this.emitClick(event);
        }
    }

    public onKeyup(event): void {
        event = event || window.event;
        if (event.keyCode === KeyCode.M_SPACE && this.isButton) {
            this.onClick(event);
        }
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
