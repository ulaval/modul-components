import Vue, { PluginObject } from 'vue';

import IconFileSandboxPlugin from '../icon-file/icon-file.sandbox';
import IconSandboxPlugin from '../icon/icon.sandbox';
import RadioSandboxPlugin from '../radio/radio-sandbox';

const SandboxesPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(IconFileSandboxPlugin);
        Vue.use(IconSandboxPlugin);
        Vue.use(RadioSandboxPlugin);
    }
};

export default SandboxesPlugin;
