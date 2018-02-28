import Vue, { PluginObject, VueConstructor } from 'vue';

import FrenchPlugin from '../../src/lang/fr';
import MessagePlugin, { currentLang, ENGLISH, FRENCH, Messages } from '../../src/utils/i18n/i18n';

export const addMessages = (v: VueConstructor<Vue>, jsonPath: string[]) => {
    const i18n: Messages = (v.prototype as any).$i18n;
    for (const path of jsonPath) {
        i18n.addMessages(ENGLISH, require(`../../src/${path}`));
    }
};

const LangHelper: PluginObject<any> = {
    install(v, options) {
        console.debug('LangHelper', 'plugin.install');
        currentLang(FRENCH);
        v.use(MessagePlugin);
        v.use(FrenchPlugin);
    }
};

export default LangHelper;
