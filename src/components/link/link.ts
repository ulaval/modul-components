import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { LINK_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconPlugin from '../icon/icon';
import WithRender from './link.html?style=./link.scss';

export enum MLinkMode {
    RouterLink = 'router-link',
    Link = 'link',
    Text = 'text',
    Button = 'button'
}

export enum MLinkIconPosition {
    Left = 'left',
    Right = 'right'
}

export enum MLinkSkin {
    light = 'light'
}

const ICON_NAME_DEFAULT: string = 'chevron';

@WithRender
@Component
export class MLink extends ModulVue {
    @Prop({ default: '/' })
    public url: string;

    @Prop({
        default: MLinkMode.RouterLink,
        validator: value =>
            value == MLinkMode.RouterLink ||
            value == MLinkMode.Link ||
            value == MLinkMode.Text ||
            value == MLinkMode.Button
    })
    public mode: MLinkMode;

    @Prop()
    public disabled: boolean;

    @Prop()
    public unvisited: boolean;

    @Prop({ default: true })
    public underline: boolean;

    @Prop({
        validator: value => value == MLinkSkin.light
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
            value == MLinkIconPosition.Left || value == MLinkIconPosition.Right
    })
    public iconPosition: MLinkIconPosition;

    @Prop({ default: '12px' })
    public iconSize: string;

    private onClick(event): void {
        this.$el.blur();
        if (this.isButton || this.isTextLink || this.disabled) {
            event.preventDefault();
        }
        if (!this.disabled) {
            this.$emit('click', event);
        }
    }

    private get isRouterLink(): boolean {
        return this.mode == MLinkMode.RouterLink;
    }

    private get isButton(): boolean {
        return this.mode == MLinkMode.Button;
    }

    private get isTextLink(): boolean {
        return this.mode == MLinkMode.Text;
    }

    private get isSkinLight(): boolean {
        return this.skin == MLinkSkin.light;
    }

    private get isUnvisited(): boolean {
        return this.isButton ? true : this.unvisited;
    }

    private get isIconPositionLeft(): boolean {
        return this.hasIcon && this.iconPosition == MLinkIconPosition.Left;
    }

    private get isIconPositionRight(): boolean {
        return this.hasIcon && this.iconPosition == MLinkIconPosition.Right;
    }

    private get hasIcon(): boolean {
        return this.iconName != undefined && this.iconName != ''
            ? true
            : this.icon;
    }

    private get propIconName(): string {
        return this.iconName != undefined && this.iconName != ''
            ? this.iconName
            : ICON_NAME_DEFAULT;
    }

    private get propUrl(): string | undefined {
        return this.mode == MLinkMode.Button
            ? '#'
            : !this.disabled ? this.url : undefined;
    }

    private get isTargetBlank(): boolean {
        return this.target == '_blank';
    }

    private get routerLinkUrl(): string | Object {
        return !this.isObject(this.url) ? { path: this.url } : this.url;
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
