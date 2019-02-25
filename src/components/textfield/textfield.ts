import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import TextareaAutoHeightPlugin from '../../directives/textarea-auto-height/textarea-auto-height';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement, InputManagementData } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import CharacterCountPlugin from '../character-count/character-count';
import { TEXTFIELD_NAME } from '../component-names';
import IconButtonPlugin from '../icon-button/icon-button';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import WithRender from './textfield.html?style=./textfield.scss';


export enum MTextfieldType {
    Text = 'text',
    Password = 'password',
    Email = 'email',
    Url = 'url',
    Telephone = 'tel',
    Search = 'search',
    Number = 'number',
    Interger = 'interger'
}

const ICON_NAME_PASSWORD_VISIBLE: string = 'm-svg__show';
const ICON_NAME_PASSWORD_HIDDEN: string = 'm-svg__hide';

@WithRender
@Component({
    mixins: [
        InputState,
        InputManagement,
        InputWidth,
        InputLabel
    ]
})
export class MTextfield extends ModulVue implements InputManagementData {

    @Prop({
        default: MTextfieldType.Text,
        validator: value =>
            value === MTextfieldType.Email ||
            value === MTextfieldType.Password ||
            value === MTextfieldType.Telephone ||
            value === MTextfieldType.Text ||
            value === MTextfieldType.Url ||
            value === MTextfieldType.Search ||
            value === MTextfieldType.Number ||
            value === MTextfieldType.Interger
    })
    public type: MTextfieldType;
    @Prop({ default: true })
    public icon: boolean;
    @Prop({ default: false })
    public wordWrap: boolean;
    @Prop()
    public characterCount: boolean;
    @Prop({ default: 0 })
    public maxLength: number;
    @Prop({ default: true })
    public lengthOverflow: boolean;
    @Prop({ default: 0 })
    public characterCountThreshold: number;

    readonly internalValue: string;

    public $refs: {
        input: HTMLInputElement
    };

    private passwordAsText: boolean = false;
    private iconDescriptionShowPassword: string = this.$i18n.translate('m-textfield:show-password');
    private iconDescriptionHidePassword: string = this.$i18n.translate('m-textfield:hide-password');
    private searchIconDescription: string = this.$i18n.translate('m-textfield:search');
    private id: string = `mTextfield-${uuid.generate()}`;

    protected created(): void {
        if (!this.$i18n) {
            throw new Error('<m-text-field> -> this.$i18n is undefined, you must install the i18n plugin.');
        }
    }

    protected mounted(): void {
        this.as<InputManagement>().trimWordWrap = this.hasWordWrap;
    }

    @Watch('type')
    private typeChanged(type: MTextfieldType): void {
        this.$log.warn(TEXTFIELD_NAME + ': Change of property "type" is not supported');
    }

    @Watch('inputType')
    private inputTypeChanged(value: string): void {
        this.as<InputManagement>().trimWordWrap = this.hasWordWrap;
    }

    @Watch('wordWrap')
    private wordWrapChanged(wordWrap: boolean): void {
        this.as<InputManagement>().trimWordWrap = this.hasWordWrap;
    }

    private onPasteTextfield(event: Event): void {
        if (this.type !== MTextfieldType.Interger) {
            this.$emit('paste', event);
        } else {
            let pasteContent: string = event['clipboardData'].getData('text');
            if (/^\d+$/.test(pasteContent) && pasteContent.length + this.as<InputManagement>().internalValue.length <= this.maxLength && this.maxLength) {
                this.$emit('paste', event);
            } else {
                event.preventDefault();
            }
        }
    }

    private onKeydownTextfield(event: KeyboardEvent): void {
        if (this.type !== MTextfieldType.Interger) {
            this.$emit('keydown', event);
        } else {
            // tslint:disable-next-line: deprecation
            if (this.maxLength && this.as<InputManagement>().internalValue.length + 1 > this.maxLength && !event.ctrlKey && event.keyCode !== 8 && event.keyCode !== 37 && event.keyCode !== 39 && event.keyCode !== 46 && event.keyCode !== 9 && event.keyCode !== 33 && event.keyCode !== 34 && event.keyCode !== 35 && event.keyCode !== 36 || event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 69 || event.keyCode === 190 || event.keyCode === 188 || event.keyCode === 107 || event.shiftKey || event.keyCode === 110) {
                event.preventDefault();
            } else {
                this.$emit('keydown', event);
            }
        }
    }

    private onDrop(event: DragEvent): void {
        if (this.type === MTextfieldType.Interger) {
            event.preventDefault();
        }
    }

    private togglePasswordVisibility(event): void {
        this.passwordAsText = !this.passwordAsText;
    }

    private onEnter(): void {
        if (this.isTypeSearch) {
            this.search();
        }
    }

    private search(): void {
        this.$emit('search');
    }

    private reset(): void {
        this.$emit('input', '');
    }

    public get inputType(): MTextfieldType {
        switch (this.type) {
            case MTextfieldType.Interger:
                return MTextfieldType.Number;
            case MTextfieldType.Password:
                return this.passwordAsText ? MTextfieldType.Text : MTextfieldType.Password;
            default:
                return this.type;
        }
    }

    private get passwordIcon(): boolean {
        return this.icon && this.type === MTextfieldType.Password && this.as<InputState>().active;
    }

    private get passwordIconName(): string {
        return this.passwordAsText ? ICON_NAME_PASSWORD_HIDDEN : ICON_NAME_PASSWORD_VISIBLE;
    }

    private get passwordIconDescription(): string {
        return this.passwordAsText ? this.iconDescriptionHidePassword : this.iconDescriptionShowPassword;
    }

    private get searchIcon(): boolean {
        return this.icon && this.type === MTextfieldType.Search;
    }

    private get hasWordWrap(): boolean {
        let hasWordWrap: boolean = this.inputType === MTextfieldType.Text && this.wordWrap;
        if (this.inputType !== MTextfieldType.Text && this.wordWrap) {
            this.$log.warn(TEXTFIELD_NAME + ': If you want to use word-wrap prop, you need to set type prop at "text"');
        }
        return hasWordWrap;
    }

    public get valueLength(): number {
        return this.internalValue.length;
    }

    private get maxLengthNumber(): number {
        return !this.lengthOverflow && this.maxLength > 0 ? this.maxLength : Infinity;
    }

    private get hasTextfieldError(): boolean {
        return this.as<InputState>().hasError;
    }

    private get isTextfieldValid(): boolean {
        return this.as<InputState>().isValid;
    }

    private get isTypeSearch(): boolean {
        return this.type === MTextfieldType.Search;
    }

    private get hasCounterTransition(): boolean {
        return !this.as<InputState>().hasErrorMessage;
    }

    private get inputPattern(): string | undefined {
        return this.type === MTextfieldType.Interger ? '[0-9]*' : undefined;
    }

    private get inputMode(): string | undefined {
        return this.type === MTextfieldType.Interger ? 'numeric' : undefined;
    }

    private resetModel(): void {
        this.$emit('input', '');
    }
}

const TextfieldPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.use(TextareaAutoHeightPlugin);
        v.use(CharacterCountPlugin);
        v.use(IconButtonPlugin);
        v.component(TEXTFIELD_NAME, MTextfield);
    }
};

export default TextfieldPlugin;
