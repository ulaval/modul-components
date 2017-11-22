import Vue from 'vue';
import '../../utils/polyfills';
import ButtonPlugin, { MButton, MButtonType, MButtonSkin, MButtonIconPosition } from './button';
import { SPINNER_CLASS } from '../spinner/spinner.spec';
import { ICON_CLASS, validateIconSize } from '../icon/icon.spec';
import SpritesHelper from '../../../tests/helpers/sprites';

const SKIN_PRIMARY_CSS: string = 'm--is-skin-primary';
const SKIN_SECONDARY_CSS: string = 'm--is-skin-secondary';
const STATE_DISABLED_CSS: string = 'm--is-disabled';
const STATE_WAITING_CSS: string = 'm--is-waiting';
const FULLSIZE_CSS: string = 'm--is-full-size';
const ICON_POSITION_LEFT_CSS: string = 'm--is-left';
const ICON_POSITION_RIGHT_CSS: string = 'm--is-right';

let button: MButton;

describe('MButtonType', () => {
    it('validates enum', () => {
        expect(MButtonType.Button).toEqual('button');
        expect(MButtonType.Submit).toEqual('submit');
        expect(MButtonType.Reset).toEqual('reset');
    });
});

describe('MButtonSkin', () => {
    it('validates enum', () => {
        expect(MButtonSkin.Primary).toEqual('primary');
        expect(MButtonSkin.Secondary).toEqual('secondary');
    });
});

describe('MButtonIconPosition', () => {
    it('validates enum', () => {
        expect(MButtonIconPosition.Left).toEqual('left');
        expect(MButtonIconPosition.Right).toEqual('right');
    });
});

describe('button', () => {
    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(ButtonPlugin);
        Vue.use(SpritesHelper);
    });

    afterEach(() => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();
        });
    });

    it('css class for button are present', () => {
        button = new MButton().$mount();
        expect(button.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeTruthy();
    });

    it('css class for button are not present', () => {
        button = new MButton().$mount();
        expect(button.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeFalsy();
        expect(button.$el.classList.contains(FULLSIZE_CSS)).toBeFalsy();
    });

    it('type prop', () => {
        button = new MButton().$mount();
        let buttonEl: HTMLButtonElement = button.$el as HTMLButtonElement;
        expect(buttonEl.type).toBe('button');

        button.type = MButtonType.Reset;
        Vue.nextTick(() => {
            expect(buttonEl.type).toBe('reset');

            button.type = MButtonType.Submit;
            Vue.nextTick(() => {
                expect(buttonEl.type).toBe('submit');
            });
        });
    });

    it('skin prop', () => {
        button = new MButton().$mount();
        expect(button.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeTruthy();
        expect(button.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();

        button.skin = MButtonSkin.Secondary;
        Vue.nextTick(() => {
            expect(button.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
            expect(button.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeTruthy();

            button.skin = MButtonSkin.Primary;
            Vue.nextTick(() => {
                expect(button.$el.classList.contains(SKIN_PRIMARY_CSS)).toBeTruthy();
                expect(button.$el.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();
            });
        });
    });

    it('disabled prop', () => {
        button = new MButton().$mount();
        expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();

        button.disabled = true;
        Vue.nextTick(() => {
            expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeTruthy();

            button.disabled = false;
            Vue.nextTick(() => {
                expect(button.$el.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
            });
        });
    });

    it('waiting prop', () => {
        button = new MButton().$mount();
        expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeFalsy();
        expect(button.$el.querySelector(SPINNER_CLASS)).toBeFalsy();

        button.waiting = true;
        Vue.nextTick(() => {
            expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeTruthy();
            expect(button.$el.querySelector(SPINNER_CLASS)).toBeTruthy();

            button.waiting = false;
            Vue.nextTick(() => {
                expect(button.$el.classList.contains(STATE_WAITING_CSS)).toBeFalsy();
                expect(button.$el.querySelector(SPINNER_CLASS)).toBeFalsy();
            });
        });
    });

    it('full-size prop', () => {
        button = new MButton().$mount();
        expect(button.$el.classList.contains(FULLSIZE_CSS)).toBeFalsy();

        button.fullSize = true;
        Vue.nextTick(() => {
            expect(button.$el.classList.contains(FULLSIZE_CSS)).toBeTruthy();

            button.fullSize = false;
            Vue.nextTick(() => {
                expect(button.$el.classList.contains(FULLSIZE_CSS)).toBeFalsy();
            });
        });
    });

    it('icon-size prop', () => {
        button = new MButton().$mount();
        button.iconName = 'default';

        Vue.nextTick(() => {
            let icon: Element | null = button.$el.querySelector(ICON_CLASS);
            expect(icon).toBeTruthy();
            if (icon) {
                validateIconSize(icon, '12px');
            }

            button.iconSize = '20px';
            Vue.nextTick(() => {
                icon = button.$el.querySelector(ICON_CLASS) as Element;
                validateIconSize(icon, '20px');
            });
        });
    });

    describe('icon-position', () => {
        beforeEach(() => {
            button = new MButton().$mount();
        });

        it('left', () => {
            expect(button.$el.querySelector(ICON_CLASS)).toBeFalsy();

            button.iconName = 'default';
            Vue.nextTick(() => {
                let leftEl: Element | null = button.$el.querySelector(ICON_CLASS);
                expect(leftEl).toBeTruthy();
                if (leftEl) {
                    expect(leftEl.classList.contains('m--is-left')).toBeTruthy();
                }

                button.iconPosition = MButtonIconPosition.Left;
                Vue.nextTick(() => {
                    let leftEl: Element | null = button.$el.querySelector(ICON_CLASS);
                    expect(leftEl).toBeTruthy();
                    if (leftEl) {
                        expect(leftEl.classList.contains('m--is-left')).toBeTruthy();
                    }
                });
            });
        });

        it('right', () => {
            expect(button.$el.querySelector(ICON_CLASS)).toBeFalsy();

            button.iconName = 'default';
            button.iconPosition = MButtonIconPosition.Right;
            Vue.nextTick(() => {
                let rightEl: Element | null = button.$el.querySelector(ICON_CLASS);
                expect(rightEl).toBeTruthy();
                if (rightEl) {
                    expect(rightEl.classList.contains('m--is-right')).toBeTruthy();
                }
            });
        });
    });

    describe('more information', () => {
        const moreInfoClass: string = '.m-button__more-info';

        it('with', () => {
            let vm = new Vue({
                template: `<m-button><template slot="more-info">Label</template></m-button>`
            }).$mount();

            expect(vm.$el.querySelector(moreInfoClass)).toBeTruthy();
        });

        it('without', () => {
            expect(button.$el.querySelector(moreInfoClass)).toBeFalsy();
        });
    });

    it('text rendering', () => {
        let vm = new Vue({
            template: `<m-button>Label</m-button>`
        }).$mount();

        let textSlot: Element | null = vm.$el.querySelector('.m-button__text');
        expect(textSlot).toBeTruthy();
        if (textSlot) {
            expect(textSlot.textContent).toBeTruthy();
            if (textSlot.textContent) {
                expect(textSlot.textContent.trim()).toBe('Label'); // inner html = 'Label <!---->', text content skip the comments but keeps space so we trim the string
            }
        }
    });

    it('click event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `<m-button @click="onClick"></m-button>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('click', true, true);

        vm.$el.dispatchEvent(e);

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);
        });
    });

});
