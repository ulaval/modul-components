import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
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
    public fullSize: boolean;

    public componentName: string = BUTTON_NAME;

    private errorMessageIcon: string = 'ERROR in <' + BUTTON_NAME + ' mode="icon"> : props "iconName" is undefined';

    private onClick(event): void {
        this.$emit('click');
        this.$el.blur();
    }

    private get propType(): string {
        return this.type != TYPE_SUBMIT && this.type != TYPE_RESET ? TYPE_BUTTON : this.type;
    }

    private get propMode(): string {
        return this.mode != MODE_SECONDARY && this.mode != MODE_ICON ? MODE_PRIMARY : this.mode;
    }

    private get propState(): string {
        return this.state != STATE_DISABLED && this.state != STATE_WAITING && this.state != STATE_SELECTED ? STATE_DEFAULT : this.state;
    }

    private get propIconSize(): string {
        if (this.iconSize == MODE_ICON) {
            return this.iconSize == undefined ? ICON_SIZE : this.iconSize;
        }
        return this.iconSize == undefined ? ICON_SIZE_SMALL : this.iconSize;
    }

    private get hasIcone(): boolean {
        return !!this.iconName;
    }

    private get hasIconeLeft(): boolean {
        return this.iconPosition == ICON_POSITION_LEFT ? true : false;
    }

    private get isDisabled(): boolean {
        if (this.propState == STATE_WAITING || this.propState == STATE_DISABLED || this.propState == STATE_SELECTED) {
            return true;
        }
        return false;
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
        v.component(BUTTON_NAME, MButton);
    }
};

export default ButtonPlugin;
