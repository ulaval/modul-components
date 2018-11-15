import { Wrapper, createLocalVue, mount, TransitionStub } from '@vue/test-utils';
import ToastPlugin, { MToast, MToastState, MToastPosition } from './toast';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { PortalMixin, Portal } from '../../mixins/portal/portal';
import { renderComponent, PortalStub } from '../../../tests/helpers/render';

let wrapper: Wrapper<MToast>;
let localVue: VueConstructor<Vue>;

// Props
let state: MToastState;
let position: MToastPosition;
let timeout: number;
let open: boolean;
let actionLabel: string;
let icon: boolean;
let offset: string;
let isSameLine: boolean;

const defaultSlot: any = {
    default: `toast message content`
};

const ACTION_LABEL: string = 'Action';

const initializeShallowWrapper: any = () => {
    wrapper = mount(MToast, {
        attachToDocument: true,
        localVue: localVue,
        slots: defaultSlot,
        propsData: {
            state,
            position,
            timeout,
            open,
            actionLabel,
            icon,
            offset,
            isSameLine
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

    describe(`Given that no props have been passed`, () => {
        beforeEach(() => {
            initializeShallowWrapper();
        });

        describe(`When the Toast is created`, () => {
            it(`Should automatically appear`, () => {
                expect(((wrapper.vm as unknown) as PortalMixin).propOpen).toBeTruthy();
                expect(((wrapper.vm as unknown) as Portal).portalCreated).toBeTruthy();
                expect(((wrapper.vm as unknown) as Portal).portalMounted).toBeTruthy();
            });

            it(`Should be in Confirmation state`, () => {
                expect(wrapper.vm.state).toEqual(MToastState.Confirmation);
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

            it(`Should not be set on the same line`, () => {
                expect(wrapper.vm.isSameLine).toBeFalsy();
            });
        });

        describe(`When the close button is clicked`, () => {
            it(`Should emit a close event`, async () => {
                wrapper.find('.m-toast__close-button').trigger('click');

                expect(wrapper.emitted('close')).toBeTruthy();
            });
        });
    });

    describe(`Given that a custom action prop have been passed`, () => {
        beforeEach(() => {
            actionLabel = ACTION_LABEL;
            initializeShallowWrapper();
        });

        describe(`When the Toast is created`, () => {
            it(`Should have an action label`, () => {
                expect(wrapper.vm.actionLabel).toBe(ACTION_LABEL);
            });

            it(`Should show a button with the label on it`, () => {
                const label: string = wrapper.find('.m-toast__close-button').html();

                expect(label).toBe(ACTION_LABEL);
            });
        });

        describe(`When the action button is clicked`, () => {
            it(`Should emit a action event`, () => {
                wrapper.find('.m-toast__actions').trigger('click');

                expect(wrapper.emitted('onAction')).toBeTruthy();
            });
        });
    });
});
