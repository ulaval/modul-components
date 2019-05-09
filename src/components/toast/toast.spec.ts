import { createLocalVue, mount, TransitionStub, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { PortalStub } from '../../../tests/helpers/render';
import { Portal, PortalMixin } from '../../mixins/portal/portal';
import ModulPlugin from '../../utils/modul/modul';
import ToastPlugin, { MToast, MToastDuration, MToastPosition, MToastState } from './toast';

jest.useFakeTimers();
let wrapper: Wrapper<MToast>;
let localVue: VueConstructor<Vue>;
let modeMobile: boolean = false;

const defaultSlot: any = {
    default: `toast message content`
};

const ACTION_LABEL: string = 'Action';

const initializeWrapper: () => any = () => {
    wrapper = mount(MToast, {
        sync: false,
        localVue: localVue,
        slots: defaultSlot,
        stubs: {
            transition: TransitionStub as any,
            portal: PortalStub as any
        },
        computed: {
            isMqMaxS: {
                get(): boolean { return modeMobile; }
            }
        }
    });
};

beforeEach(() => {
    wrapper = undefined as any;
});

describe(`MToast`, () => {
    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        localVue.use(ModulPlugin);
        localVue.use(ToastPlugin);
    });

    describe(`Given that no props have been passed`, async () => {
        beforeEach(async () => {
            initializeWrapper();
            await Vue.nextTick();
        });

        describe(`When the Toast is created`, () => {
            it(`Should automatically appear`, async () => {
                expect(((wrapper.vm as any) as PortalMixin).propOpen).toBe(true);
                expect(((wrapper.vm as any) as Portal).portalCreated).toBe(true);
                await Vue.nextTick();
                expect(((wrapper.vm as any) as Portal).portalMounted).toBe(true);
            });

            it(`Should be in Confirmation state`, () => {
                expect(wrapper.vm.state).toEqual(MToastState.Confirmation);
            });

            it(`Should be in the bottom-right position`, () => {
                expect(wrapper.vm.position).toEqual(MToastPosition.BottomRight);
            });

            it(`Should have a timeout set to none`, () => {
                expect(wrapper.vm.timeout).toEqual('none');
            });

            it(`Should have an icon`, () => {
                expect(wrapper.vm.icon).toBe(true);
            });

            it(`Should have an offset set to 0 as a string`, () => {
                expect(wrapper.vm.offset).toEqual('0');
            });
        });

        describe(`When the close button is clicked`, () => {
            it(`Should emit a close event`, () => {

                wrapper.find('.m-toast__close-button').trigger('click');

                expect(wrapper.emitted('close')).toBeTruthy();
            });
        });
    });

    describe(`Given that a custom action prop have been passed`, () => {
        beforeEach(async () => {
            initializeWrapper();
            await jest.runOnlyPendingTimers(); // wait for component to be instantiated

            wrapper.setProps({
                actionLabel: ACTION_LABEL
            });
        });


        describe(`When the Toast is created`, () => {
            it(`Should have an action label`, () => {
                expect(wrapper.vm.actionLabel).toBe(ACTION_LABEL);
            });

            it(`Should show a button with the label on it`, async () => {
                const label: string = wrapper.find('.m-toast__actions').html();

                expect(label).toContain(ACTION_LABEL);
            });
        });

        describe(`When the action button is clicked`, () => {
            it(`Should emit a action event`, () => {
                wrapper.find('.m-toast__actions').find('.m-link').trigger('click');

                expect(wrapper.emitted('action-button')).toBeTruthy();
            });
        });
    });

    describe(`Given that a timeout prop have been passed`, () => {
        describe(`When the Toast is created`, () => {

            describe(`Then the mouse is not over the toast`, () => {
                it(`Should appear and then disappear`, async () => {
                    initializeWrapper();
                    wrapper.setProps({
                        timeout: 'short'
                    });
                    await jest.runOnlyPendingTimers(); // wait for component to be instantiated
                    expect(((wrapper.vm as any) as PortalMixin).propOpen).toBe(true);
                    expect(((wrapper.vm as any) as Portal).portalCreated).toBe(true);
                    expect(((wrapper.vm as any) as Portal).portalMounted).toBe(true);

                    await jest.runOnlyPendingTimers(); // wait for the timeout to be over

                    expect(((wrapper.vm as any) as PortalMixin).propOpen).toBeFalsy();
                });
            });

            describe(`Then the mouse is over the toast`, () => {
                it(`Should appear and then not disappear`, async () => {
                    initializeWrapper();
                    wrapper.setProps({
                        timeout: 'short'
                    });
                    await jest.runOnlyPendingTimers(); // wait for component to be instantiated
                    expect(((wrapper.vm as any) as PortalMixin).propOpen).toBe(true);
                    expect(((wrapper.vm as any) as Portal).portalCreated).toBe(true);
                    expect(((wrapper.vm as any) as Portal).portalMounted).toBe(true);

                    wrapper.vm.mouseEnterToast();
                    await jest.runOnlyPendingTimers(); // wait for the timeout to be over

                    expect(((wrapper.vm as any) as PortalMixin).propOpen).toBe(true);
                });
            });

            describe(`Then the mouse is over and leave the toast`, () => {
                it(`Should appear and then not disappear`, async () => {
                    const now: number = Date.now();
                    global.Date.now = jest.fn(() => now);

                    initializeWrapper();
                    wrapper.setProps({
                        timeout: 'short'
                    });
                    await jest.runOnlyPendingTimers(); // wait for component to be instantiated
                    expect(((wrapper.vm as any) as PortalMixin).propOpen).toBe(true);
                    expect(((wrapper.vm as any) as Portal).portalCreated).toBe(true);
                    expect(((wrapper.vm as any) as Portal).portalMounted).toBe(true);
                    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), MToastDuration.DesktopShort);

                    let customWaitingTime: number = 500;
                    global.Date.now = jest.fn(() => now + customWaitingTime); // Fast-forward dates in 500ms

                    wrapper.vm.mouseEnterToast();
                    expect(((wrapper.vm as any) as PortalMixin).propOpen).toBe(true);

                    wrapper.vm.mouseLeaveToast();
                    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), MToastDuration.DesktopShort - customWaitingTime);

                    await jest.runOnlyPendingTimers(); // wait for the timeout to be over
                    expect(((wrapper.vm as any) as PortalMixin).propOpen).toBeFalsy();
                });
            });
        });
    });

    describe(`Givent that a open prop have been passed and variable is false`, () => {
        beforeEach(async () => {
            initializeWrapper();
            await jest.runOnlyPendingTimers();
            wrapper.setProps({
                open: false
            });
        });
        describe(`When the Toast is created`, () => {
            it(`Should not appear`, () => {
                expect(((wrapper.vm as any) as PortalMixin).propOpen).toBeFalsy();
            });
        });
        describe(`When the variable is set to true`, () => {
            it(`should appear`, () => {
                wrapper.vm.$props.open = true;
                expect(((wrapper.vm as any) as PortalMixin).propOpen).toBe(true);
            });
        });
    });

    describe(`Given that calling function 'doCustomPropOpen'`, () => {
        const elementHtml: HTMLElement = createMockHTMLElementStyleAbsolute();
        describe(`with mode desktop'`, () => {
            beforeEach(() => {
                modeMobile = false;
                initializeWrapper();
            });

            describe(`When timeout prop 'long`, () => {
                beforeEach(() => {
                    wrapper.setProps({
                        timeout: 'long'
                    });
                    wrapper.vm.doCustomPropOpen(true, elementHtml);
                });

                it(`should appear after MToastDuration.DesktopLong `, async () => {
                    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), MToastDuration.DesktopLong);
                });
            });

            describe(`When timeout prop 'short'`, () => {
                beforeEach(() => {
                    wrapper.setProps({
                        timeout: 'short'
                    });
                    wrapper.vm.doCustomPropOpen(true, elementHtml);
                });

                it(`should appear after MToastDuration.DesktopShort `, async () => {
                    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), MToastDuration.DesktopShort);
                });
            });
        });

        describe(`with mode mobile `, () => {
            beforeEach(() => {
                modeMobile = true;
                initializeWrapper();
            });
            describe(`When timeout prop 'long`, () => {
                beforeEach(() => {
                    wrapper.setProps({
                        timeout: 'long'
                    });
                    wrapper.vm.doCustomPropOpen(true, elementHtml);
                });

                it(`should appear after MToastDuration.MobileLong `, async () => {
                    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), MToastDuration.MobileLong);
                });
            });

            describe(`When timeout prop 'short'`, () => {
                beforeEach(() => {
                    wrapper.setProps({
                        timeout: 'short'
                    });
                    wrapper.vm.doCustomPropOpen(true, elementHtml);
                });

                it(`should appear after MToastDuration.MobileShort `, async () => {
                    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), MToastDuration.MobileShort);
                });
            });
        });

        function createMockHTMLElementStyleAbsolute(): HTMLElement {
            return {
                style: {
                    position: 'absolute'
                }
            } as HTMLElement;
        }

    });
});
