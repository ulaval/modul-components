import '../polyfills';
import Vue from 'vue';
import i18nPlugin from './i18n';

describe('i18n plugin', () => {
    it('registers $i18n on vue instance', () => {
        Vue.use(i18nPlugin);

        Vue.use({
            install(v, options): void {
                expect((v as any).$i18n).toBeDefined();
            }
        });
    });

    it('registers $i18n on vue prototype', () => {
        Vue.use(i18nPlugin);

        let Ex = Vue.extend({
            created: function() {
                expect((this as any).$i18n).toBeDefined();
            }
        });

        const ex = new Ex();
    });
});
