import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './button.html?style=./button.scss';
import { BUTTON_NAME, ICON_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import SpinnerPlugin from '../spinner/spinner';

export enum MButtonType {
    Button = 'button',
    Submit = 'submit',
    Reset = 'reset'
}

export enum MButtonSkin {
    Primary = 'primary',
    Secondary = 'secondary'
}

export enum MButtonIconPosition {
    Left = 'left',
    Right = 'right'
}

@WithRender
@Component
export class MButton extends Vue {

    @Prop({
        default: MButtonType.Button,
        validator: value =>
            value == MButtonType.Button ||
            value == MButtonType.Submit ||
            value == MButtonType.Reset
    })
    public type: MButtonType;
    @Prop({
        default: MButtonSkin.Primary,
        validator: value =>
            value == MButtonSkin.Primary ||
            value == MButtonSkin.Secondary
    })
    public skin: MButtonSkin;
    @Prop()
    public disabled: boolean;
    @Prop()
    public waiting: boolean;
    @Prop()
    public fullSize: boolean;
    @Prop()
    public iconName: string;
    @Prop({
        default: MButtonIconPosition.Left,
        validator: value =>
            value == MButtonIconPosition.Left ||
            value == MButtonIconPosition.Right
    })
    public iconPosition: MButtonIconPosition;
    @Prop({ default: '12px' })
    public iconSize: string;

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

    private get isSkinPrimary(): boolean {
        return this.skin == MButtonSkin.Primary;
    }

    private get isSkinSecondary(): boolean {
        return this.skin == MButtonSkin.Secondary;
    }

    private get isWaiting(): boolean {
        return !this.disabled ? this.waiting : false;
    }

    private get hasIcone(): boolean {
        return !!this.iconName;
    }

    private get hasIconeLeft(): boolean {
        return this.iconPosition == MButtonIconPosition.Left && this.hasIcone && !this.waiting ? true : false;
    }

    private get hasIconeRight(): boolean {
        return this.iconPosition == MButtonIconPosition.Right && this.hasIcone && !this.waiting ? true : false;
    }

    private get hasMoreInfoSlot(): boolean {
        return !!this.$slots['more-info'];
    }
}

const ButtonPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug(BUTTON_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.use(SpinnerPlugin);
        v.component(BUTTON_NAME, MButton);
    }
};

export default ButtonPlugin;
