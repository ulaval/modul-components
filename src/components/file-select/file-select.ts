import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './file-select.html?style=./file-select.scss';
import { FILE_SELECT_NAME, BUTTON_NAME } from '../component-names';
import ButtonPlugin, { MButtonSkin, MButtonType, MButtonIconPosition } from '../button/button';
import uuid from '../../utils/uuid/uuid';

@WithRender
@Component
export class MFileSelect extends Vue {

    @Prop()
    public label: string;
    @Prop({
        default: MButtonSkin.Secondary,
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

    private id: string = `mFileSelect-${uuid.generate()}`;
    private focused: boolean = false;

    private onClick(event: Event): void {
        this.$emit('click', event);
        this.$el.blur();
    }

    private onFocus(event: Event): void {
        this.$emit('focus');
        this.focused = true;
    }

    private onBlur(event: Event): void {
        this.$emit('blur');
        this.focused = false;
    }

    private get isSkinPrimary(): boolean {
        return this.skin == MButtonSkin.Primary;
    }

    private get isSkinSecondary(): boolean {
        return this.skin == MButtonSkin.Secondary;
    }

    private get isWaiting(): boolean {
        console.log(this.disabled, this.waiting);

        return !this.disabled ? this.waiting : false;
    }

    private get hasIcone(): boolean {
        return !!this.iconName;
    }

    private get hasIconLeft(): boolean {
        return this.iconPosition == MButtonIconPosition.Left && this.hasIcone && !this.waiting;
    }

    private get hasIconRight(): boolean {
        return this.iconPosition == MButtonIconPosition.Right && this.hasIcone && !this.waiting;
    }

    private get hasWaitingIconLeft(): boolean {
        return this.iconPosition == MButtonIconPosition.Left && this.waiting;
    }

    private get hasWaitingIconRight(): boolean {
        return this.iconPosition == MButtonIconPosition.Right && this.waiting;
    }

    private get hasPrecisionSlot(): boolean {
        return !!this.$slots.precision;
    }

    private get hasLabel(): boolean {
        return !!this.label;
    }
}

const FileSelectPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug(FILE_SELECT_NAME, 'plugin.install');
        v.use(ButtonPlugin);
        v.component(FILE_SELECT_NAME, MFileSelect);
    }
};

export default FileSelectPlugin;
