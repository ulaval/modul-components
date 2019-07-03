import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { BUTTON_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import SpinnerPlugin from '../spinner/spinner';
import WithRender from './button.html?style=./button.scss';

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
            value === MButtonType.Button ||
            value === MButtonType.Submit ||
            value === MButtonType.Reset
    })
    public type: MButtonType;
    @Prop({
        default: MButtonSkin.Primary,
        validator: value =>
            value === MButtonSkin.Primary ||
            value === MButtonSkin.Secondary
    })
    public skin: MButtonSkin;

    @Prop()
    public precision: string;
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
            value === MButtonIconPosition.Left ||
            value === MButtonIconPosition.Right
    })
    public iconPosition: MButtonIconPosition;
    @Prop({ default: '12px' })
    public iconSize: string;

    @Emit('click')
    onClick(event: Event): void {
        (this.$el as HTMLElement).blur();
    }

    @Emit('focus')
    onFocus(event: Event): void { }

    @Emit('blur')
    onBlur(event: Event): void { }

    get isSkinPrimary(): boolean {
        return this.skin === MButtonSkin.Primary;
    }

    get isSkinSecondary(): boolean {
        return this.skin === MButtonSkin.Secondary;
    }

    get isWaiting(): boolean {
        return !this.disabled ? this.waiting : false;
    }

    get hasIcone(): boolean {
        return !!this.iconName;
    }

    get hasIconLeft(): boolean {
        return this.iconPosition === MButtonIconPosition.Left && this.hasIcone && !this.waiting;
    }

    get hasIconRight(): boolean {
        return this.iconPosition === MButtonIconPosition.Right && this.hasIcone && !this.waiting;
    }

    get hasWaitingIconLeft(): boolean {
        return this.iconPosition === MButtonIconPosition.Left && this.waiting;
    }

    get hasWaitingIconRight(): boolean {
        return this.iconPosition === MButtonIconPosition.Right && this.waiting;
    }

    get hasPrecision(): boolean {
        return !!this.precision || !!this.$slots.precision;
    }
}

const ButtonPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(BUTTON_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.use(SpinnerPlugin);
        v.component(BUTTON_NAME, MButton);
    }
};

export default ButtonPlugin;
