import Vue, { PluginObject } from 'vue';

import IconFileSandboxPlugin from '../components/icon-file/icon-file.sandbox';
import IconSandboxPlugin from '../components/icon/icon.sandbox';
import RadioSandboxPlugin from '../components/radio/radio.sandbox';
import TextfieldSandboxPlugin from '../components/textfield/textfield.sandbox';

const SandboxesPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(IconFileSandboxPlugin);
        Vue.use(IconSandboxPlugin);
        Vue.use(RadioSandboxPlugin);
        Vue.use(TextfieldSandboxPlugin);
    }
};

export default SandboxesPlugin;
