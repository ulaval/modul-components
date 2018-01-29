import Vue from 'vue';
import '../../utils/polyfills';
import FileSelectPlugin, { MFileSelect } from './file-select';
import ButtonPlugin, { MButton, MButtonType, MButtonSkin, MButtonIconPosition } from '../button/button';
import { SPINNER_CLASS } from '../spinner/spinner.spec';
import { ICON_CLASS, validateIconSize } from '../icon/icon.spec';
import SpritesHelper from '../../../tests/helpers/sprites';
import LangHelper from '../../../tests/helpers/lang';

const SKIN_PRIMARY_CSS: string = 'm--is-skin-primary';
const SKIN_SECONDARY_CSS: string = 'm--is-skin-secondary';
const STATE_DISABLED_CSS: string = 'm--is-disabled';
const STATE_WAITING_CSS: string = 'm--is-waiting';
const FULLSIZE_CSS: string = 'm--is-full-size';
const ICON_POSITION_LEFT_CSS: string = 'm--is-left';
const ICON_POSITION_RIGHT_CSS: string = 'm--is-right';

let fileSelect: MFileSelect;

describe('file-select', () => {
    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(FileSelectPlugin);
        Vue.use(SpritesHelper);
        Vue.use(LangHelper);
    });

    afterEach(done => {
        Vue.nextTick(() => {

            done();
        });
    });

    it('css class for file-select button are present', () => {
        fileSelect = new MFileSelect().$mount();
        let button = fileSelect.$el.querySelector('button');
        if (button) {
            expect(button.classList.contains(SKIN_SECONDARY_CSS)).toBeTruthy();
        }
    });

    it('css class for file-select button are not present', () => {
        fileSelect = new MFileSelect().$mount();
        let button = fileSelect.$el.querySelector('button');
        if (button) {
            expect(button.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
            expect(button.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
            expect(button.classList.contains(STATE_WAITING_CSS)).toBeFalsy();
            expect(button.classList.contains(FULLSIZE_CSS)).toBeFalsy();
        }
    });

    it('skin prop', done => {
        fileSelect = new MFileSelect().$mount();
        let button = fileSelect.$el.querySelector('button');
        if (button) {
            expect(button.classList.contains(SKIN_SECONDARY_CSS)).toBeTruthy();
            expect(button.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
        }

        fileSelect.skin = MButtonSkin.Primary;
        Vue.nextTick(() => {
            if (button) {
                expect(button.classList.contains(SKIN_SECONDARY_CSS)).toBeFalsy();
                expect(button.classList.contains(SKIN_PRIMARY_CSS)).toBeTruthy();
            }

            fileSelect.skin = MButtonSkin.Secondary;
            Vue.nextTick(() => {
                if (button) {
                    expect(button.classList.contains(SKIN_SECONDARY_CSS)).toBeTruthy();
                    expect(button.classList.contains(SKIN_PRIMARY_CSS)).toBeFalsy();
                }

                done();
            });
        });
    });

    it('disabled prop', done => {
        fileSelect = new MFileSelect().$mount();
        let button = fileSelect.$el.querySelector('button');
        if (button) {
            expect(button.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
        }

        fileSelect.disabled = true;
        Vue.nextTick(() => {
            if (button) {
                expect(button.classList.contains(STATE_DISABLED_CSS)).toBeTruthy();
            }

            fileSelect.disabled = false;
            Vue.nextTick(() => {
                if (button) {
                    expect(button.classList.contains(STATE_DISABLED_CSS)).toBeFalsy();
                }

                done();
            });
        });
    });

    it('waiting prop', done => {
        fileSelect = new MFileSelect().$mount();
        let button = fileSelect.$el.querySelector('button');
        if (button) {
            expect(button.classList.contains(STATE_WAITING_CSS)).toBeFalsy();
            expect(button.querySelector(SPINNER_CLASS)).toBeFalsy();
        }

        fileSelect.waiting = true;
        Vue.nextTick(() => {
            if (button) {
                expect(button.classList.contains(STATE_WAITING_CSS)).toBeTruthy();
                expect(button.querySelector(SPINNER_CLASS)).toBeTruthy();
            }

            fileSelect.waiting = false;
            Vue.nextTick(() => {
                if (button) {
                    expect(button.classList.contains(STATE_WAITING_CSS)).toBeFalsy();
                    expect(button.querySelector(SPINNER_CLASS)).toBeFalsy();
                }

                done();
            });
        });
    });

    it('full-size prop', done => {
        fileSelect = new MFileSelect().$mount();
        let button = fileSelect.$el.querySelector('button');
        if (button) {
            expect(button.classList.contains(FULLSIZE_CSS)).toBeFalsy();
        }

        fileSelect.fullSize = true;
        Vue.nextTick(() => {
            if (button) {
                expect(button.classList.contains(FULLSIZE_CSS)).toBeTruthy();
            }

            fileSelect.fullSize = false;
            Vue.nextTick(() => {
                if (button) {
                    expect(button.classList.contains(FULLSIZE_CSS)).toBeFalsy();
                }

                done();
            });
        });
    });

    it('icon-size prop', done => {
        fileSelect = new MFileSelect().$mount();
        fileSelect.iconName = 'default';
        let button = fileSelect.$el.querySelector('button');
        Vue.nextTick(() => {
            let icon: Element | null;
            if (button) {
                icon = button.querySelector(ICON_CLASS);
                expect(icon).toBeTruthy();
                if (icon) {
                    validateIconSize(icon, '12px');
                }
            }

            fileSelect.iconSize = '20px';
            Vue.nextTick(() => {
                if (button) {
                    icon = button.querySelector(ICON_CLASS) as Element;
                    validateIconSize(icon, '20px');
                }

                done();
            });
        });
    });

    describe('icon-position', () => {
        let button;
        beforeEach(() => {
            fileSelect = new MFileSelect().$mount();
            button = fileSelect.$el.querySelector('button');
        });

        it('left', done => {
            expect(button.querySelector(ICON_CLASS)).toBeFalsy();

            fileSelect.iconName = 'default';
            Vue.nextTick(() => {
                let leftEl: Element | null = button.querySelector(ICON_CLASS);
                expect(leftEl).toBeTruthy();
                if (leftEl) {
                    expect(leftEl.classList.contains('m--is-left')).toBeTruthy();
                }

                fileSelect.iconPosition = MButtonIconPosition.Left;
                Vue.nextTick(() => {
                    let leftEl: Element | null = button.querySelector(ICON_CLASS);
                    expect(leftEl).toBeTruthy();
                    if (leftEl) {
                        expect(leftEl.classList.contains('m--is-left')).toBeTruthy();
                    }

                    done();
                });
            });
        });

        it('right', done => {
            expect(button.querySelector(ICON_CLASS)).toBeFalsy();

            fileSelect.iconName = 'default';
            fileSelect.iconPosition = MButtonIconPosition.Right;
            Vue.nextTick(() => {
                let rightEl: Element | null = button.querySelector(ICON_CLASS);
                expect(rightEl).toBeTruthy();
                if (rightEl) {
                    expect(rightEl.classList.contains('m--is-right')).toBeTruthy();
                }

                done();
            });
        });
    });

    it('multiple prop', done => {
        fileSelect = new MFileSelect().$mount();
        let input = fileSelect.$el.querySelector('input');

        if (input) {
            expect(input.attributes.getNamedItem('multiple')).toBeFalsy();
        }

        fileSelect.multiple = true;
        Vue.nextTick(() => {
            if (input) {
                expect(input.attributes.getNamedItem('multiple')).toBeTruthy();
            }

            fileSelect.multiple = false;
            Vue.nextTick(() => {
                if (input) {
                    expect(input.attributes.getNamedItem('multiple')).toBeFalsy();
                }

                done();
            });
        });
    });

    it('click event', done => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `<m-file-select @click="onClick"></m-file-select>`,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let e: any = document.createEvent('HTMLEvents');
        e.initEvent('click', true, true);

        vm.$el.dispatchEvent(e);

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalledWith(e);

            done();
        });
    });

});
