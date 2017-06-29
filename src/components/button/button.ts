import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './button.html?style=./button.scss';
import { BUTTON_NAME } from '../component-names';
import { ICON_NAME } from '../component-names';

const TYPE_BUTTON: string = 'button';
const TYPE_SUBMIT: string = 'submit';
const TYPE_RESET: string = 'reset';

const MODE_PRIMARY: string = 'primary';
const MODE_SECONDARY: string = 'secondary';
const MODE_ICON: string = 'icon';

const STATE_DEFAULT: string = 'default';
const STATE_DISABLED: string = 'disabled';
const STATE_WAITING: string = 'waiting';
const STATE_SELECTED: string = 'selected';

const ICON_POSITION_LEFT: string = 'left';
const ICON_SIZE: string = '16px';
const ICON_SIZE_SMALL: string = '12px';

@WithRender
@Component
export class MButton extends Vue {

    @Prop({ default: TYPE_BUTTON })
    public type: string;
    @Prop({ default: MODE_PRIMARY })
    public mode: string;
    @Prop({ default: STATE_DEFAULT })
    public state: string;
    @Prop()
    public iconName: string;
    @Prop({ default: ICON_POSITION_LEFT })
    public iconPosition: string;
    @Prop()
    public iconSize: string;
    @Prop({ default: false })
    public isFullSize: boolean;

    public componentName: string = BUTTON_NAME;

    private propsType: string = TYPE_BUTTON;
    private propsMode: string = MODE_PRIMARY;
    private propsState: string = STATE_DEFAULT;
    private propsIconSize: string = ICON_SIZE;

    private errorMessageIcon: string = 'ERROR in <' + BUTTON_NAME + ' mode="icon"> : props "iconName" is undefined';

    @Watch('mode')
    private changeMode(newMode): void {
        this.propsState = this.getMode(newMode);
    }

    @Watch('state')
    private changeState(newState): void {
        this.propsState = this.getState(newState);
    }

    private beforeMount(): void {
        this.propsType = this.type != TYPE_SUBMIT && this.type != TYPE_RESET ? TYPE_BUTTON : this.type;
        this.propsMode = this.getMode(this.mode);
        this.propsState = this.getState(this.state);
        if (this.propsMode == MODE_ICON) {
            this.propsIconSize = this.iconSize == undefined ? ICON_SIZE : this.iconSize;
        } else {
            this.propsIconSize = this.iconSize == undefined ? ICON_SIZE_SMALL : this.iconSize;
        }
    }

    private getMode(mode: string): string {
        return mode != MODE_SECONDARY && mode != MODE_ICON ? MODE_PRIMARY : mode;
    }

    private getState(state: string): string {
        return state != STATE_DISABLED && state != STATE_WAITING && state != STATE_SELECTED ? STATE_DEFAULT : state;
    }

    private onClick(event): void {
        this.$emit('click');
        this.$el.blur();
    }

    private get hasIcone(): boolean {
        return !!this.iconName;
    }

    private get hasIconeLeft(): boolean {
        return this.iconPosition == ICON_POSITION_LEFT ? true : false;
    }

    private get hasMoreInfo(): boolean {
        return !!this.$slots['more-info'];
    }

    private get hasSlots(): boolean {
        return !!this.$slots.default;
    }

    private get isDisabled(): boolean {
        if (this.propsState == STATE_WAITING || this.propsState == STATE_DISABLED || this.propsState == STATE_SELECTED) {
            return true;
        }
        return false;
    }
}

const ButtonPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(BUTTON_NAME, MButton);
    }
};

export default ButtonPlugin;
