import './polyfills';
import Vue from 'vue';
import MediaQueryPlugin from './media-query';

describe('MediaQuery plugin', () => {
    it('registers $mq on vue instance', () => {
        Vue.use(MediaQueryPlugin);

        Vue.use({
            install(v, options) {
                expect((v as any).$mq).toBeDefined();
            }
        });
    });

    it('registers $mq on vue prototype', () => {
        Vue.use(MediaQueryPlugin);

        let Ex = Vue.extend({
            created: function() {
                expect((this as any).$mq).toBeDefined();
            }
        });

        const ex = new Ex();
    });
});
