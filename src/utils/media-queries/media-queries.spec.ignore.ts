import Vue, { VueConstructor } from 'vue';
import '../polyfills';
import MediaQueriesPlugin from './media-queries';



describe('Media Queries plugin', () => {
    let vue: any;
    it('registers $mq on vue instance', () => {
        Vue.use(MediaQueriesPlugin);

        Vue.use({
            install(v, options): void {
                vue = v;
                expect((v as any).$mq).toBeDefined();
            }
        });
    });


    it('registers $mq on vue prototype', () => {
        Vue.use(MediaQueriesPlugin);

        let Ex: VueConstructor<Vue> = Vue.extend({
            created: () => {
                expect(vue.$mq).toBeDefined();
            }
        });

        const ex: Vue = new Ex();
    });
});
