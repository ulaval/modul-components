import { createLocalVue, mount, TransitionStub, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { PortalStub, renderComponent } from '../../../tests/helpers/render';
import { Portal, PortalMixin } from '../../mixins/portal/portal';
import ToastPlugin, { MToast, MToastPosition, MToastState } from './toast';
import ModulPlugin from '../../utils/modul/modul';

jest.useFakeTimers();
let wrapper: Wrapper<MToast>;
let localVue: VueConstructor<Vue>;

const defaultSlot: any = {
    default: `toast message content`
};

const ACTION_LABEL: string = 'Action';

const initializeWrapper: () => any = () => {
    wrapper = mount(MToast, {
        localVue: localVue,
        slots: defaultSlot,
        stubs: {
            transition: TransitionStub,
            portal: PortalStub
        }
    });
};

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
            jest.runOnlyPendingTimers(); // wait for component to be instancialized
        });

        describe(`When the Toast is created`, () => {
            it(`Should automatically appear`, () => {
                expect(((wrapper.vm as any) as PortalMixin).propOpen).toBe(true);
                expect(((wrapper.vm as any) as Portal).portalCreated).toBe(true);
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
        beforeEach(() => {
            wrapper.setProps({
                actionLabel: ACTION_LABEL
            });
        });


        describe(`When the Toast is created`, () => {
            it(`Should have an action label`, () => {
                expect(wrapper.vm.actionLabel).toBe(ACTION_LABEL);
            });

            it(`Should show a button with the label on it`, () => {
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
            it(`Should appear and then disappear`, () => {
                initializeWrapper();
                wrapper.setProps({
                    timeout: 'short'
                });
                jest.runOnlyPendingTimers(); // wait for component to be instancialized

                expect(((wrapper.vm as any) as PortalMixin).propOpen).toBe(true);
                expect(((wrapper.vm as any) as Portal).portalCreated).toBe(true);
                expect(((wrapper.vm as any) as Portal).portalMounted).toBe(true);

                jest.runOnlyPendingTimers(); // wait for the 5000 ms to be over

                expect(((wrapper.vm as any) as PortalMixin).propOpen).toBeFalsy();
            });
        });
    });

    describe(`Givent that a open prop have been passed and variable is false`, () => {
        beforeEach(() => {
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
});
