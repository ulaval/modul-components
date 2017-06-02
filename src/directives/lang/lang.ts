import Vue, { VNodeDirective } from 'vue';
import { PluginObject } from 'vue';
import { I18N_NAME } from '../directives-names';
import Messages from '@/utils/i18n';

export class MI18n extends Vue {
    public bind(element: HTMLElement, binding: VNodeDirective) {
        element.innerText = Messages.translate(binding.value);
    }
}

const MI18nPlugin: PluginObject<any> = {
    install(v, options) {
        v.directive(I18N_NAME, new MI18n());
    }
};

export default MI18nPlugin;
