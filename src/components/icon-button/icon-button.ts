import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './icon-button.html?style=./icon-button.scss';
import { ICON_BUTTON_NAME, ICON_NAME } from '../component-names';
import IconPlugin from '../icon/icon';

export enum MIconButtonSkin {
    Light = 'light',
    Dark = 'dark',
    Primary = 'primary',
    Secondary = 'secondary'
}

@WithRender
@Component
export class MIconButton extends Vue {
    @Prop({
        default: MIconButtonSkin.Light,
        validator: value =>
            value == MIconButtonSkin.Light ||
            value == MIconButtonSkin.Dark ||
            value == MIconButtonSkin.Primary ||
            value == MIconButtonSkin.Secondary
    })
    public skin: MIconButtonSkin;
    @Prop()
    public disabled: boolean;
    @Prop({ default: '44px' })
    public buttonSize: string;
    @Prop({ default: 'default' })
    public iconName: string;
    @Prop({ default: '16px' })
    public iconSize: string;
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
        return this.skin == MIconButtonSkin.Light;
    }

    private get isSkinDark(): boolean {
        return this.skin == MIconButtonSkin.Dark;
    }

    private get isSkinPrimary(): boolean {
        return this.skin == MIconButtonSkin.Primary;
    }

    private get isSkinSecondary(): boolean {
        return this.skin == MIconButtonSkin.Secondary;
    }

    private hasSlots(): boolean {
        let hasSlot: boolean = !!this.$slots.default;
        if (!hasSlot) {
            // console.warn('<' + ICON_BUTTON_NAME + '> needs a text in its default slot that will describe its function. This text will be hidden and only read by the screen readers.');
        }
        return hasSlot;
    }
}

const IconButtonPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug(ICON_BUTTON_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.component(ICON_BUTTON_NAME, MIconButton);
    }
};

export default IconButtonPlugin;
