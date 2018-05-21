import Vue, { PluginObject } from 'vue';

import CharacterCountSandboxPlugin from '../components/character-count/character-count.sandbox';
import CheckboxSandboxPlugin from '../components/checkbox/checkbox.sandbox';
import ErrorMessageSandboxPlugin from '../components/error-message/error-message.sandbox';
import IconFileSandboxPlugin from '../components/icon-file/icon-file.sandbox';
import IconSandboxPlugin from '../components/icon/icon.sandbox';
import PageNotFoundSandboxPlugin from '../components/page-not-found/page-not-found.sandbox';
import RadioGroupSandboxPlugin from '../components/radio-group/radio-group.sandbox';
import RadioSandboxPlugin from '../components/radio/radio.sandbox';
import TextareaSandboxPlugin from '../components/textarea/textarea.sandbox';
import TextfieldSandboxPlugin from '../components/textfield/textfield.sandbox';

const SandboxesPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(CharacterCountSandboxPlugin);
        Vue.use(CheckboxSandboxPlugin);
        Vue.use(ErrorMessageSandboxPlugin);
        Vue.use(IconFileSandboxPlugin);
        Vue.use(IconSandboxPlugin);
        Vue.use(PageNotFoundSandboxPlugin);
        Vue.use(RadioSandboxPlugin);
        Vue.use(RadioGroupSandboxPlugin);
        Vue.use(TextareaSandboxPlugin);
        Vue.use(TextfieldSandboxPlugin);
    }
};

export default SandboxesPlugin;
