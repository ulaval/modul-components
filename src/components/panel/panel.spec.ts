import Vue from 'vue';
import '../../utils/polyfills';
import PanelPlugin, { MPanel, MPanelMode } from './panel';

const MODE_PRIMARY_CSS: string = 'm--is-primary';
const MODE_SECONDARY_CSS: string = 'm--is-secondary';
const NO_SHADOW_CSS: string = 'm--no-shadow';
const NO_BORDER_CSS: string = 'm--no-border';
const NO_PADDING_CSS: string = 'm--no-padding';

let message: MPanel;

describe('panel', () => {
    beforeEach(() => {
        Vue.use(PanelPlugin);
        message = new MPanel().$mount();
    });

    it('css class for button group are not present', () => {
        expect(message.$el.classList.contains(MODE_SECONDARY_CSS)).toBeFalsy();
        expect(message.$el.classList.contains(NO_SHADOW_CSS)).toBeFalsy();
        expect(message.$el.classList.contains(NO_BORDER_CSS)).toBeFalsy();
    });

    it('mode prop', () => {
        expect(message.$el.classList.contains(MODE_SECONDARY_CSS)).toBeFalsy();

        message.mode = MPanelMode.Secondary;
        Vue.nextTick(() => {
            expect(message.$el.classList.contains(MODE_SECONDARY_CSS)).toBeTruthy();
            expect(message.$el.classList.contains(MODE_PRIMARY_CSS)).toBeFalsy();

            message.mode = MPanelMode.Primary;
            Vue.nextTick(() => {
                expect(message.$el.classList.contains(MODE_PRIMARY_CSS)).toBeTruthy();
                expect(message.$el.classList.contains(MODE_SECONDARY_CSS)).toBeFalsy();
            });
        });
    });

    it('shadow prop', () => {
        expect(message.$el.classList.contains(NO_SHADOW_CSS)).toBeFalsy();

        message.shadow = false;
        Vue.nextTick(() => {
            expect(message.$el.classList.contains(NO_SHADOW_CSS)).toBeTruthy();

            message.shadow = true;
            Vue.nextTick(() => {
                expect(message.$el.classList.contains(NO_SHADOW_CSS)).toBeFalsy();
            });
        });
    });

    it('border prop', () => {
        expect(message.$el.classList.contains(NO_BORDER_CSS)).toBeFalsy();

        message.border = false;
        Vue.nextTick(() => {
            expect(message.$el.classList.contains(NO_BORDER_CSS)).toBeTruthy();

            message.border = true;
            Vue.nextTick(() => {
                expect(message.$el.classList.contains(NO_BORDER_CSS)).toBeFalsy();
            });
        });
    });

    it('padding prop', () => {
        let vm = new Vue({
            data: {
                hasPadding: true
            },
            template: `
            <div>
                <m-panel ref="a" :padding="hasPadding">
                <span slot="header">Titre</span>
                aborum exercitation occaecat nulla aliquip.
                <span slot="footer">Aute elit ullamco excepteur veniam</span>
                </m-panel>
            </div>`,
            methods: {
            }
        }).$mount();

        let header: Element | null = (vm.$refs.a as Vue).$el.querySelector('header');
        let body: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-panel__body');
        let footer: Element | null = (vm.$refs.a as Vue).$el.querySelector('footer');
        if (header) {
            expect(header.classList.contains(NO_PADDING_CSS)).toBeFalsy();
        }
        if (body) {
            expect(body.classList.contains(NO_PADDING_CSS)).toBeFalsy();
        }
        if (footer) {
            expect(footer.classList.contains(NO_PADDING_CSS)).toBeFalsy();
        }

        (vm as any).hasPadding = false;
        Vue.nextTick(() => {
            let header: Element | null = (vm.$refs.a as Vue).$el.querySelector('header');
            let body: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-panel__body');
            let footer: Element | null = (vm.$refs.a as Vue).$el.querySelector('footer');
            if (header) {
                expect(header.classList.contains(NO_PADDING_CSS)).toBeTruthy();
            }
            if (body) {
                expect(body.classList.contains(NO_PADDING_CSS)).toBeTruthy();
            }
            if (footer) {
                expect(footer.classList.contains(NO_PADDING_CSS)).toBeTruthy();
            }
        });
    });

    it('header padding prop', () => {
        let vm = new Vue({
            data: {
                hasPadding: true
            },
            template: `
            <div>
                <m-panel ref="a" :paddingHeader="hasPadding">
                <span slot="header">Titre</span>
                aborum exercitation occaecat nulla aliquip.
                <span slot="footer">Aute elit ullamco excepteur veniam</span>
                </m-panel>
            </div>`,
            methods: {
            }
        }).$mount();

        let header: Element | null = (vm.$refs.a as Vue).$el.querySelector('header');
        if (header) {
            expect(header.classList.contains(NO_PADDING_CSS)).toBeFalsy();
        }

        (vm as any).hasPadding = false;
        Vue.nextTick(() => {
            let header: Element | null = (vm.$refs.a as Vue).$el.querySelector('header');
            if (header) {
                expect(header.classList.contains(NO_PADDING_CSS)).toBeTruthy();
            }
        });
    });

    it('body padding prop', () => {
        let vm = new Vue({
            data: {
                hasPadding: true
            },
            template: `
            <div>
                <m-panel ref="a" :paddingBody="hasPadding">
                <span slot="header">Titre</span>
                aborum exercitation occaecat nulla aliquip.
                <span slot="footer">Aute elit ullamco excepteur veniam</span>
                </m-panel>
            </div>`,
            methods: {
            }
        }).$mount();

        let body: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-panel__body');
        if (body) {
            expect(body.classList.contains(NO_PADDING_CSS)).toBeFalsy();
        }

        (vm as any).hasPadding = false;
        Vue.nextTick(() => {
            let body: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-panel__body');
            if (body) {
                expect(body.classList.contains(NO_PADDING_CSS)).toBeTruthy();
            }
        });
    });

    it('footer padding prop', () => {
        let vm = new Vue({
            data: {
                hasPadding: true
            },
            template: `
            <div>
                <m-panel ref="a" :paddingFooter="hasPadding">
                <span slot="header">Titre</span>
                aborum exercitation occaecat nulla aliquip.
                <span slot="footer">Aute elit ullamco excepteur veniam</span>
                </m-panel>
            </div>`,
            methods: {
            }
        }).$mount();

        let footer: Element | null = (vm.$refs.a as Vue).$el.querySelector('footer');
        if (footer) {
            expect(footer.classList.contains(NO_PADDING_CSS)).toBeFalsy();
        }

        (vm as any).hasPadding = false;
        Vue.nextTick(() => {
            let footer: Element | null = (vm.$refs.a as Vue).$el.querySelector('footer');
            if (footer) {
                expect(footer.classList.contains(NO_PADDING_CSS)).toBeTruthy();
            }
        });
    });

});
