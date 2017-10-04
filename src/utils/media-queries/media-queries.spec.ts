import '../polyfills';
import Vue from 'vue';
import MediaQueriesPlugin from './media-queries';

describe('Media Queries plugin', () => {
    it('registers $mq on vue instance', () => {
        Vue.use(MediaQueriesPlugin);

        Vue.use({
            install(v, options) {
                expect((v as any).$mq).toBeDefined();
            }
        });
    });

    it('registers $mq on vue prototype', () => {
        Vue.use(MediaQueriesPlugin);

        let Ex = Vue.extend({
            created: function() {
                expect((this as any).$mq).toBeDefined();
            }
        });

        const ex = new Ex();
    });
});
