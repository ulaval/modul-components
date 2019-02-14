import Vue, { VueConstructor } from 'vue';

import MessagePlugin, { ENGLISH, Messages } from '../../src/utils/i18n/i18n';

export const addMessages: (v: VueConstructor<Vue>, jsonPath: string[]) => void =
    (v: VueConstructor<Vue>, jsonPath: string[]) => {
        const i18n: Messages = (v.prototype).$i18n;
        for (const path of jsonPath) {
            i18n.addMessages(ENGLISH, require(`../../src/${path}`));
        }
    };
