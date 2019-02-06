import '../polyfills';

import Vue, { VueConstructor } from 'vue';

import MediaQueriesPlugin from './media-queries';

describe('Media Queries plugin', () => {
    it('registers $mq on vue instance', () => {
        Vue.use(MediaQueriesPlugin);

        Vue.use({
            install(v, options): void {
                expect((v as any).$mq).toBeDefined();
            }
        });
    });

    it('registers $mq on vue prototype', () => {
        Vue.use(MediaQueriesPlugin);

        let Ex: VueConstructor<Vue> = Vue.extend({
            created: () => {
                expect((this).$mq).toBeDefined();
            }
        });

        const ex: Vue = new Ex();
    });
});
