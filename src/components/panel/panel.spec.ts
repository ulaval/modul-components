import Vue from 'vue';
import '../../utils/polyfills';
import PanelPlugin, { MPanel, MPanelSkin } from './panel';

const SKIN_LIGHT_CSS: string = 'm--is-skin-light';
const SKIN_DARK_CSS: string = 'm--is-skin-dark';
const HAS_HIGHLIGHTING_BORDER_CSS: string = 'm--has-highlighting-border';
const NO_SHADOW_CSS: string = 'm--no-shadow';
const NO_BORDER_CSS: string = 'm--no-border';
const NO_PADDING_CSS: string = 'm--no-padding';

let panel: MPanel;

describe('MPanelSkin', () => {
    it('validates enum', () => {
        expect(MPanelSkin.Light).toEqual('light');
        expect(MPanelSkin.Dark).toEqual('dark');
    });
});

describe('panel', () => {
    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(PanelPlugin);
        panel = new MPanel().$mount();
    });

    afterEach(done => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();

            done();
        });
    });

    it('css class for panel are not present', () => {
        expect(panel.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();
        expect(panel.$el.classList.contains(NO_SHADOW_CSS)).toBeFalsy();
        expect(panel.$el.classList.contains(NO_BORDER_CSS)).toBeFalsy();
    });

    it('skin prop', done => {
        expect(panel.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();

        panel.skin = MPanelSkin.Dark;
        Vue.nextTick(() => {
            expect(panel.$el.classList.contains(SKIN_DARK_CSS)).toBeTruthy();
            expect(panel.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();

            panel.skin = MPanelSkin.Light;
            Vue.nextTick(() => {
                expect(panel.$el.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();
                expect(panel.$el.classList.contains(SKIN_DARK_CSS)).toBeFalsy();

                done();
            });
        });
    });

    it('highlighting-border prop', done => {
        expect(panel.$el.classList.contains(HAS_HIGHLIGHTING_BORDER_CSS)).toBeTruthy();

        panel.highlightingBorder = false;
        Vue.nextTick(() => {
            expect(panel.$el.classList.contains(HAS_HIGHLIGHTING_BORDER_CSS)).toBeFalsy();

            done();
        });
    });

    it('shadow prop', done => {
        expect(panel.$el.classList.contains(NO_SHADOW_CSS)).toBeFalsy();

        panel.shadow = false;
        Vue.nextTick(() => {
            expect(panel.$el.classList.contains(NO_SHADOW_CSS)).toBeTruthy();

            done();
        });
    });

    it('border prop', done => {
        expect(panel.$el.classList.contains(NO_BORDER_CSS)).toBeFalsy();

        panel.border = false;
        Vue.nextTick(() => {
            expect(panel.$el.classList.contains(NO_BORDER_CSS)).toBeTruthy();

            done();
        });
    });

    it('padding prop', done => {
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

            done();
        });
    });

    it('header padding prop', done => {
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

            done();
        });
    });

    it('body padding prop', done => {
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

            done();
        });
    });

    it('footer padding prop', done => {
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
            done();
        });
    });

    it('click event', () => {
        console.log('TODO');
    });
});
