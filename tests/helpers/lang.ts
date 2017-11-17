import { PluginObject } from 'vue';
import MessagePlugin, { currentLang, FRENCH } from '../../src/utils/i18n/i18n';
import FrenchPlugin from '../../src/lang/fr';

const LangHelper: PluginObject<any> = {
    install(v, options) {
        console.debug('LangHelper', 'plugin.install');
        currentLang(FRENCH);
        v.use(MessagePlugin);
        v.use(FrenchPlugin);
    }
};

export default LangHelper;
