import '../../utils/polyfills';
import Vue from 'vue';
import Mi18nPlugin, { MI18n } from './i18n';
import LangHelper from '../../../tests/helpers/lang';
import { FRENCH } from '../../utils/i18n/i18n';

let i18n: MI18n;

describe('i18n', () => {
    beforeAll(() => {
        Vue.use(LangHelper);
        Vue.use(Mi18nPlugin);

        (Vue as any).$i18n.addMessages(FRENCH, require('./i18n.spec.lang.fr.json'));
    });

    it('k prop', () => {
        let vm: Vue = new Vue({
            data: {
                key: 'm-i18n-spec:a'
            },
            template: `
            <div>
                <m-i18n ref="a" :k="key"></m-i18n>
            </div>`
        }).$mount();

        expect((vm.$refs.a as Vue).$el.textContent).toBe('test a');

        (vm as any).key = 'm-i18n-spec:b';
        Vue.nextTick(() => {
            expect((vm.$refs.a as Vue).$el.textContent).toBe('test b');
        });
    });

    it('warn if key not defined', () => {
        spyOn(console, 'warn');
        const warn: string = 'The key undefined:key does not exist. Current lang: fr';

        let vm: Vue = new Vue({
            template: `
            <div>
                <m-i18n ref="a" k="undefined:key"></m-i18n>
            </div>`
        }).$mount();

        expect((vm.$refs.a as Vue).$el.textContent).toBe('undefined:key');
        expect(console.warn).toHaveBeenCalledWith(warn);
    });

    it('params prop', () => {
        let vm: Vue = new Vue({
            data: {
                prm: ['a', 'b']
            },
            template: `
            <div>
                <m-i18n ref="a" k="m-i18n-spec:with-params" :params="prm"></m-i18n>
            </div>`
        }).$mount();

        expect((vm.$refs.a as Vue).$el.textContent).toBe('test a, test b');

        (vm as any).prm = [1, 2];
        Vue.nextTick(() => {
            expect((vm.$refs.a as Vue).$el.textContent).toBe('test 1, test 2');
        });
    });

    it('html-encode prop', () => {
        let vm: Vue = new Vue({
            data: {
                encode: false
            },
            template: `
            <div>
                <m-i18n ref="a" k="m-i18n-spec:html-encode" :params="['<i>', '</i>']" :html-encode="encode"></m-i18n>
            </div>`
        }).$mount();

        expect((vm.$refs.a as Vue).$el.innerHTML).toBe('<i>test</i>');

        (vm as any).encode = true;
        Vue.nextTick(() => {
            expect((vm.$refs.a as Vue).$el.innerHTML).toBe('&lt;i&gt;test&lt;/i&gt;');
        });
    });
});
