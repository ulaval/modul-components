import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { INTEGERFIELD_NAME } from '../component-names';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import WithRender from './integerfield.html?style=./integerfield.scss';


const ALLOWED_KEYCODE: number[] = [8, 9, 33, 34, 35, 36, 37, 39, 46];

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

    @Prop({ default: 0 })
    public maxLength: number;

    @Prop({ default: true })
    public lengthOverflow: boolean;

    public internalValue: number;

    private id: string = `mIntegerfield-${uuid.generate()}`;

    private onPasteTextfield(event: Event): void {
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

    private onKeydownTextfield(event: KeyboardEvent): void {
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

    private onDropTextfield(event: DragEvent): void {
        event.preventDefault();
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

    private get inputPattern(): string | undefined {
        return '[0-9]*';
    }

    private get inputMode(): string | undefined {
        return 'numeric';
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