import Vue, { PluginObject } from 'vue';

import RadioSandboxPlugin from '../radio/sandbox';

const SandboxesPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(RadioSandboxPlugin);
    }
};

export default SandboxesPlugin;
