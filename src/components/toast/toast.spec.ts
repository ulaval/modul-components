import { createLocalVue, mount, TransitionStub, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { PortalStub } from '../../../tests/helpers/render';
import { Portal, PortalMixin } from '../../mixins/portal/portal';
import { MMessageState } from '../message/message';
import ToastPlugin, { MToast, MToastPosition } from './toast';

jest.useFakeTimers();
let wrapper: Wrapper<MToast>;
let localVue: VueConstructor<Vue>;

// Props
let state: MMessageState;
let position: MToastPosition;
let timeout: number;
let open: boolean;
let actionLabel: string;
let icon: boolean;
let offset: string;

const defaultSlot: any = {
    default: `toast message content`
};

const ACTION_LABEL: string = 'Action';

const initializeShallowWrapper: () => any = () => {
    wrapper = mount(MToast, {
        localVue: localVue,
        slots: defaultSlot,
        propsData: {
            state,
            position,
            timeout,
            open,
            actionLabel,
            icon,
            offset
        },
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
        localVue.use(ToastPlugin);
    });

    describe(`Given that no props have been passed`, async () => {
        beforeEach(async () => {
            initializeShallowWrapper();
            jest.runOnlyPendingTimers(); // wait for component to be instancialized
        });

        describe(`When the Toast is created`, () => {
            it(`Should automatically appear`, () => {
                expect(((wrapper.vm as unknown) as PortalMixin).propOpen).toBeTruthy();
                expect(((wrapper.vm as unknown) as Portal).portalCreated).toBeTruthy();
                expect(((wrapper.vm as unknown) as Portal).portalMounted).toBeTruthy();
            });

            it(`Should be in Confirmation state`, () => {
                expect(wrapper.vm.state).toEqual(MMessageState.Confirmation);
            });

            it(`Should be in the bottom-right position`, () => {
                expect(wrapper.vm.position).toEqual(MToastPosition.BottomRight);
            });

            it(`Should have a timeout set to 0`, () => {
                expect(wrapper.vm.timeout).toEqual(0);
            });

            it(`Should have an icon`, () => {
                expect(wrapper.vm.icon).toBeTruthy();
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
            actionLabel = ACTION_LABEL;
            initializeShallowWrapper();
            jest.runOnlyPendingTimers(); // wait for component to be instancialized
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
                wrapper.find('.m-toast__actions').find('m-link').trigger('click');

                expect(wrapper.emitted('action-button')).toBeTruthy();
            });
        });
    });

    describe(`Given that a timeout prop have been passed`, () => {
        describe(`When the Toast is created`, () => {
            it(`Should appear and then disappear`, () => {
                timeout = 5000;
                initializeShallowWrapper();
                jest.runOnlyPendingTimers(); // wait for component to be instancialized

                expect(((wrapper.vm as unknown) as PortalMixin).propOpen).toBeTruthy();
                expect(((wrapper.vm as unknown) as Portal).portalCreated).toBeTruthy();
                expect(((wrapper.vm as unknown) as Portal).portalMounted).toBeTruthy();

                jest.runOnlyPendingTimers(); // wait for the 5000 ms to be over

                expect(((wrapper.vm as unknown) as PortalMixin).propOpen).toBeFalsy();
            });
        });
    });

    describe(`Givent that a open prop have been passed and variable is false`, () => {
        beforeEach(() => {
            open = false;
            initializeShallowWrapper();
            jest.runOnlyPendingTimers(); // wait for component to be instancialized
        });
        describe(`When the Toast is created`, () => {
            it(`Should not appear`, () => {
                expect(((wrapper.vm as unknown) as PortalMixin).propOpen).toBeFalsy();
            });
        });
        describe(`When the variable is set to true`, () => {
            it(`should appear`, () => {
                wrapper.vm.$props.open = true;
                expect(((wrapper.vm as unknown) as PortalMixin).propOpen).toBeTruthy();
            });
        });
    });
});
