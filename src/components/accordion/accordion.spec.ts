import Vue from 'vue';
import '../../utils/polyfills';
import AccordionPlugin, { MAccordion, MAccordionIconPosition, MAccordionIconSize, MAccordionIconSkin, MAccordionSkin } from './accordion';

const CLOSED_CSS: string = 'm--is-closed';
const SKIN_LIGHT_CSS: string = 'm--is-light';
const SKIN_REGULAR_CSS: string = 'm--is-regular';
const SKIN_PLAIN_CSS: string = 'm--is-plain';
const ICON_POSITION_LEFT_CSS: string = 'm--is-icon-left';
const ICON_SIZE_LARGE_CSS: string = 'm--is-large';
const ICON_SKIN_BORDER_CSS: string = 'm--has-border';

let accordion: MAccordion;

describe('MAccordionSkin', () => {
    it('validates enum', () => {
        expect(MAccordionSkin.Light).toEqual('light');
        expect(MAccordionSkin.Regular).toEqual('regular');
        expect(MAccordionSkin.Plain).toEqual('plain');
    });
});

describe('MAccordionIconPosition', () => {
    it('validates enum', () => {
        expect(MAccordionIconPosition.Left).toEqual('left');
        expect(MAccordionIconPosition.Right).toEqual('right');
    });
});

describe('MAccordionIconSkin', () => {
    it('validates enum', () => {
        expect(MAccordionIconSkin.Border).toEqual('border');
        expect(MAccordionIconSkin.Default).toEqual('default');
    });
});

describe('MAccordionIconSize', () => {
    it('validates enum', () => {
        expect(MAccordionIconSize.Small).toEqual('small');
        expect(MAccordionIconSize.Large).toEqual('large');
    });
});

describe('button', () => {
    beforeEach(() => {
        Vue.use(AccordionPlugin);
        accordion = new MAccordion().$mount();
    });

    it('css class for accordion are present', () => {
        expect(accordion.$el.classList.contains(CLOSED_CSS)).toBeTruthy();
        expect(accordion.$el.classList.contains(SKIN_REGULAR_CSS)).toBeTruthy();
        expect(accordion.$el.querySelector('.' + ICON_POSITION_LEFT_CSS)).toBeTruthy();
        expect(accordion.$el.querySelector('.' + ICON_SIZE_LARGE_CSS)).toBeTruthy();
        expect(accordion.$el.querySelector('.' + ICON_SKIN_BORDER_CSS)).toBeFalsy();
    });

    it('css class for button are not present', () => {
        expect(accordion.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
        expect(accordion.$el.classList.contains(SKIN_PLAIN_CSS)).toBeFalsy();
    });

    it('open prop', () => {
        accordion.open = true;
        Vue.nextTick(() => {
            expect(accordion.$el.classList.contains(CLOSED_CSS)).toBeFalsy();

            accordion.open = false;
            Vue.nextTick(() => {
                expect(accordion.$el.classList.contains(CLOSED_CSS)).toBeTruthy();
            });
        });
    });

    it('skin prop', () => {
        accordion.skin = MAccordionSkin.Light;
        Vue.nextTick(() => {
            expect(accordion.$el.classList.contains(SKIN_LIGHT_CSS)).toBeTruthy();
            expect(accordion.$el.classList.contains(SKIN_REGULAR_CSS)).toBeFalsy();
            expect(accordion.$el.classList.contains(SKIN_PLAIN_CSS)).toBeFalsy();

            accordion.skin = MAccordionSkin.Regular;
            Vue.nextTick(() => {
                expect(accordion.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                expect(accordion.$el.classList.contains(SKIN_REGULAR_CSS)).toBeTruthy();
                expect(accordion.$el.classList.contains(SKIN_PLAIN_CSS)).toBeFalsy();

                accordion.skin = MAccordionSkin.Plain;
                Vue.nextTick(() => {
                    expect(accordion.$el.classList.contains(SKIN_LIGHT_CSS)).toBeFalsy();
                    expect(accordion.$el.classList.contains(SKIN_REGULAR_CSS)).toBeFalsy();
                    expect(accordion.$el.classList.contains(SKIN_PLAIN_CSS)).toBeTruthy();
                });
            });
        });
    });

    it('icon position prop', () => {
        accordion.iconPosition = MAccordionIconPosition.Left;
        Vue.nextTick(() => {
            expect(accordion.$el.querySelector('.' + ICON_POSITION_LEFT_CSS)).toBeTruthy();

            accordion.iconPosition = MAccordionIconPosition.Right;
            Vue.nextTick(() => {
                expect(accordion.$el.querySelector('.' + ICON_POSITION_LEFT_CSS)).toBeFalsy();
            });
        });
    });

    it('icon size prop', () => {
        accordion.iconSize = MAccordionIconSize.Large;
        Vue.nextTick(() => {
            expect(accordion.$el.querySelector('.' + ICON_SIZE_LARGE_CSS)).toBeTruthy();

            accordion.iconSize = MAccordionIconSize.Small;
            Vue.nextTick(() => {
                expect(accordion.$el.querySelector('.' + ICON_SIZE_LARGE_CSS)).toBeFalsy();
            });
        });
    });

    it('icon skin prop', () => {
        accordion.iconSkin = MAccordionIconSkin.Border;
        Vue.nextTick(() => {
            expect(accordion.$el.querySelector('.' + ICON_SKIN_BORDER_CSS)).toBeTruthy();

            accordion.iconSkin = MAccordionIconSkin.Default;
            Vue.nextTick(() => {
                expect(accordion.$el.querySelector('.' + ICON_SKIN_BORDER_CSS)).toBeFalsy();
            });
        });
    });

    it('accordion open', () => {
        let vm = new Vue({
            template: `
            <div>
                <m-accordion ref="a"></m-accordion>
            </div>`
        }).$mount();

        let body: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-accordion__body-wrap');
        expect(body).toBeNull();

        (vm as MAccordion).open = true;
        Vue.nextTick(() => {
            body = (vm.$refs.a as Vue).$el.querySelector('.m-accordion__body-wrap');
            expect(body).toBeTruthy();
        });
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `
            <div>
                <m-accordion ref="a" @click="onClick"></m-accordion>
            </div>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let header: Element | null = (vm.$refs.a as Vue).$el.querySelector('.m-accordion__header');

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('click', true, true);

        if (header) {
            header.dispatchEvent(e);
        }
        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);
        });
    });

});
