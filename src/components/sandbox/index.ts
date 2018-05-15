import Vue, { PluginObject } from 'vue';

import ErrorMessageSandboxPlugin from '../error-message/error-message.sandbox';
import PageNotFoundSandboxPlugin from '../page-not-found/page-not-found.sandbox';
import RadioSandboxPlugin from '../radio/radio.sandbox';

const SandboxesPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(ErrorMessageSandboxPlugin);
        Vue.use(PageNotFoundSandboxPlugin);
        Vue.use(RadioSandboxPlugin);
    }
};

export default SandboxesPlugin;
