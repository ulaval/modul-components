import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './button.html?style=./button.scss';
import { BUTTON_NAME } from '../component-names';
import { ICON_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import SpinnerPlugin from '../spinner/spinner';

export enum MButtonType {
    Button = 'button',
    Submit = 'submit',
    Reset = 'reset'
}

export enum MButtonMode {
    Primary = 'primary',
    Secondary = 'secondary',
    Icon = 'icon'
}

export enum MButtonState {
    Default = 'default',
    Disabled = 'disabled',
    Waiting = 'waiting',
    Selected = 'selected'
}

export enum MButtonIconPosition {
    Left = 'left',
    Right = 'right'
}

const ICON_SIZE: string = '16px';
const ICON_SIZE_SMALL: string = '12px';

@WithRender
@Component
export class MButton extends Vue {

    @Prop({ default: MButtonType.Button })
    public type: MButtonType;
    @Prop({ default: MButtonMode.Primary })
    public mode: MButtonMode;
    @Prop({ default: MButtonState.Default })
    public state: MButtonState;
    @Prop()
    public iconName: string;
    @Prop({ default: MButtonIconPosition.Left })
    public iconPosition: MButtonIconPosition;
    @Prop()
    public iconSize: string;
    @Prop({ default: false })
    public fullSize: boolean;

    public componentName: string = BUTTON_NAME;

    private errorMessageIcon: string = 'ERROR in <' + BUTTON_NAME + ' mode="icon"> : props "icon-name" is undefined';

    private onClick(event): void {
        this.$emit('click', event);
        this.$el.blur();
    }

    private onFocus(): void {
        this.$emit('focus');
    }

    private onBlur(): void {
        this.$emit('blur');
    }

    private get propType(): string {
        return this.type != MButtonType.Submit && this.type != MButtonType.Reset ? MButtonType.Button : this.type;
    }

    private get propMode(): string {
        return this.mode != MButtonMode.Secondary && this.mode != MButtonMode.Icon ? MButtonMode.Primary : this.mode;
    }

    private get propState(): string {
        return this.state != MButtonState.Disabled && this.state != MButtonState.Waiting && this.state != MButtonState.Selected ? MButtonState.Default : this.state;
    }

    private get propIconSize(): string {
        if (this.mode == MButtonMode.Icon) {
            return this.iconSize == undefined ? ICON_SIZE : this.iconSize;
        }
        return this.iconSize == undefined ? ICON_SIZE_SMALL : this.iconSize;
    }

    private get hasIcone(): boolean {
        return !!this.iconName;
    }

    private get hasIconeLeft(): boolean {
        return this.iconPosition == MButtonIconPosition.Left ? true : false;
    }

    private get isDisabled(): boolean {
        return this.propState == MButtonState.Waiting || this.propState == MButtonState.Disabled || this.propState == MButtonState.Selected;
    }

    private get hasMoreInfo(): boolean {
        return !!this.$slots['more-info'];
    }

    private get hasSlots(): boolean {
        return !!this.$slots.default;
    }
}

const ButtonPlugin: PluginObject<any> = {
    install(v, options) {
        v.use(IconPlugin);
        v.use(SpinnerPlugin);
        v.component(BUTTON_NAME, MButton);
    }
};

export default ButtonPlugin;
