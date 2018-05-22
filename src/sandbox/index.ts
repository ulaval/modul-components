import Vue, { PluginObject } from 'vue';

import AccordionSandboxPlugin from '../components/accordion/accordion.sandbox';
import ErrorMessageSandboxPlugin from '../components/error-message/error-message.sandbox';
import IconFileSandboxPlugin from '../components/icon-file/icon-file.sandbox';
import IconSandboxPlugin from '../components/icon/icon.sandbox';
import PageNotFoundSandboxPlugin from '../components/page-not-found/page-not-found.sandbox';
import RadioSandboxPlugin from '../components/radio/radio.sandbox';
import SessionExpiredSandboxPlugin from '../components/session-expired/session-expired.sandbox';
import TextfieldSandboxPlugin from '../components/textfield/textfield.sandbox';

const SandboxesPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(AccordionSandboxPlugin);
        Vue.use(ErrorMessageSandboxPlugin);
        Vue.use(IconFileSandboxPlugin);
        Vue.use(IconSandboxPlugin);
        Vue.use(PageNotFoundSandboxPlugin);
        Vue.use(RadioSandboxPlugin);
        Vue.use(SessionExpiredSandboxPlugin);
        Vue.use(TextfieldSandboxPlugin);
    }
};

export default SandboxesPlugin;
