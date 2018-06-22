import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { ICON_BUTTON_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import WithRender from './icon-button.html?style=./icon-button.scss';

export enum MIconButtonSkin {
    Light = 'light',
    Dark = 'dark',
    Primary = 'primary',
    Secondary = 'secondary',
    Link = 'link'
}

@WithRender
@Component
export class MIconButton extends Vue {
    @Prop({
        default: MIconButtonSkin.Light,
        validator: value =>
            value === MIconButtonSkin.Light ||
            value === MIconButtonSkin.Dark ||
            value === MIconButtonSkin.Primary ||
            value === MIconButtonSkin.Secondary ||
            value === MIconButtonSkin.Link
    })
    public skin: MIconButtonSkin;
    @Prop()
    public disabled: boolean;
    @Prop({ default: '44px' })
    public buttonSize: string;
    @Prop({ default: 'm-m-svg__close-clear' })
    public iconName: string;
    @Prop({ default: '20px' })
    public iconSize: string;
    @Prop({ default: true })
    public ripple: boolean;
    @Prop()
    public title: string;

    protected mounted(): void {
        this.hasSlots();
    }

    private onClick(event: Event): void {
        this.$emit('click', event);
        this.$el.blur();
    }

    private onFocus(event: Event): void {
        this.$emit('focus');
    }

    private onBlur(event: Event): void {
        this.$emit('blur');
    }

    private get isSkinLight(): boolean {
        return this.skin === MIconButtonSkin.Light;
    }

    private get isSkinDark(): boolean {
        return this.skin === MIconButtonSkin.Dark;
    }

    private get isSkinPrimary(): boolean {
        return this.skin === MIconButtonSkin.Primary;
    }

    private get isSkinSecondary(): boolean {
        return this.skin === MIconButtonSkin.Secondary;
    }

    private get isSkinLink(): boolean {
        return this.skin === MIconButtonSkin.Link;
    }

    private hasSlots(): boolean {
        let hasSlot: boolean = !!this.$slots.default;
        if (!hasSlot) {
            // Vue.prototype.$log.warn('<' + ICON_BUTTON_NAME + '> needs a text in its default slot that will describe its function. This text will be hidden and only read by the screen readers.');
        }
        return hasSlot;
    }
}

const IconButtonPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(ICON_BUTTON_NAME, 'plugin.install');
        v.prototype.$log.warn(ICON_BUTTON_NAME + ' is not ready for production');
        v.use(IconPlugin);
        v.component(ICON_BUTTON_NAME, MIconButton);
    }
};

export default IconButtonPlugin;
