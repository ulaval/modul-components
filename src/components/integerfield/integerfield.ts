import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { KeyCode } from '../../utils/keycode/keycode';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { INTEGERFIELD_NAME } from '../component-names';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import WithRender from './integerfield.html?style=./integerfield.scss';


const ALLOWED_KEYCODE: number[] = [
    KeyCode.M_BACK_SPACE,
    KeyCode.M_TAB,
    KeyCode.M_PAGE_UP,
    KeyCode.M_PAGE_DOWN,
    KeyCode.M_END,
    KeyCode.M_HOME,
    KeyCode.M_LEFT,
    KeyCode.M_RIGHT,
    KeyCode.M_DELETE
];

@WithRender
@Component({
    mixins: [
        InputState,
        InputWidth,
        InputLabel,
        InputManagement
    ]
})
export class MIntegerfield extends ModulVue {

    @Prop()
    @Model('input')
    public value: number;

    @Prop()
    public placeholder: string;

    @Prop()
    public readonly: boolean;

    @Prop({
        default: 16,
        validator(value: any): boolean {
            const numericValue: number = parseInt(value, 10);
            if (!isNaN(numericValue) && numericValue <= 16) {
                return true;
            }

            return false;
        }
    })
    public maxLength: number;

    public internalValue: number;

    private id: string = `mIntegerfield-${uuid.generate()}`;

    private onPasteIntegerfield(event: Event): void {
        let pasteContent: string = event['clipboardData'].getData('text');
        if (/^\d+$/.test(pasteContent)) {
            if (!isFinite(this.maxLengthNumber) || isFinite(this.maxLengthNumber) && String(pasteContent).length + this.internalValue.toString().length <= this.maxLength) {
                this.$emit('paste', event);
            } else {
                event.preventDefault();
            }
        } else {
            event.preventDefault();
        }
    }

    private onKeydownIntegerfield(event: KeyboardEvent): void {
        // tslint:disable-next-line: deprecation
        if (isFinite(this.maxLengthNumber) && this.internalValue.toString().length + 1 > this.maxLengthNumber && !event.ctrlKey && ALLOWED_KEYCODE.indexOf(event.keyCode) === -1 || !event.ctrlKey && ALLOWED_KEYCODE.indexOf(event.keyCode) === -1 && this.isNumberKeycode(event.keyCode)) {
            event.preventDefault();
        } else {
            this.$emit('keydown', event);
        }

    }

    private isNumberKeycode(keycode): boolean {
        return keycode > 31 && (keycode < 48 || keycode > 57) && (keycode < 96 || keycode > 105);
    }

    private onDropIntegerfield(event: DragEvent): void {
        event.preventDefault();
    }

    private get maxLengthNumber(): number {
        return this.maxLength > 0 ? this.maxLength : Infinity;
    }

    private get hasIntegerfieldError(): boolean {
        return this.as<InputState>().hasError;
    }

    private get isIntegerfieldValid(): boolean {
        return this.as<InputState>().isValid;
    }

    private get inputPattern(): string | undefined {
        return '[0-9]*';
    }

    private get inputMode(): string | undefined {
        return 'numeric';
    }

    @Watch('value')
    private onValueChange(value: number): void {
        this.model = value.toString();
    }

    private get model(): string {
        return ((this as any) as InputManagement).internalValue;
    }

    private set model(value: string) {
        ((this as any) as InputManagement).internalValue = value;
        this.$emit('input', Number.parseInt(value, 10));
    }
}

const IntegerfieldPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.component(INTEGERFIELD_NAME, MIntegerfield);
    }
};

export default IntegerfieldPlugin;
