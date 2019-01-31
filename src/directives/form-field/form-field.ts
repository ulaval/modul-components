import { FormField } from 'src/utils/form/form-field/form-field';
import { DirectiveOptions, PluginObject, VNode, VNodeDirective } from 'vue';
import { FORM_FIELD_NAME } from '../directive-names';


const FormFieldDirective: DirectiveOptions = {
    inserted(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        let formField: FormField<any> = binding.value;

        el.addEventListener('blur', () => {
            formField.touch();
        }, true);
    },
    update(
        el: HTMLElement,
        binding: VNodeDirective,
        vnode: VNode
    ): void {
        let formField: FormField<any> = binding.value;

        if (formField.shouldFocus) {
            const selector: string = 'input, textarea, [contenteditable=true]';
            const elements: NodeListOf<Element> = el.querySelectorAll(selector);

            if (elements.length > 0) {
                (elements[0] as any).focus();
            }

            formField.shouldFocus = false;
        }
    }
};

const FormFieldDirectivePlugin: PluginObject<any> = {
    install(v, options): void {
        v.directive(FORM_FIELD_NAME, FormFieldDirective);
    }
};

export default FormFieldDirectivePlugin;
