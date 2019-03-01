import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { INPUT_NAME } from '../component-names';
import WithRender from './input.html';



@WithRender
@Component
export class MInput extends ModulVue {


    @Prop()
    @Model('input')
    inputValue: string;

    onInput($event: InputEvent): void {
        this.$emit('input', ($event.target as any).value);
    }

    onFocus($event: any): void {
        this.$emit('focus', $event);
    }

    onBlur($event: any): void {
        this.$emit('blur', $event);
    }

    onKeyup($event: any): void {
        this.$emit('keyup', $event);
    }

    onKeydownTextfield($event: any): void {
        this.$emit('keydown', $event);
    }

    onEnter($event: any): void {
        this.$emit('keydown.enter', $event);
    }

    onPasteTextfield($event: any): void {
        this.$emit('paste', $event);
    }

    onDropTextfield($event: any): void {
        this.$emit('drop', $event);
    }

    onChange($event: any): void {
        this.$emit('change', $event);
    }

}


const InputPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(INPUT_NAME, MInput);
    }
};

export default InputPlugin;
