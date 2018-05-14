import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import { ICON_NAME } from '../component-names';
import { MIcon } from '../icon/icon';
import MessagePlugin, { MMessage, MMessageSkin, MMessageState } from './message';

describe('MMessage', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(MessagePlugin);
        addMessages(localVue, ['components/message/message.lang.en.json']);
    });

    it('should render correctly', () => {
        const msg: Wrapper<MMessage> = mount(MMessage, {
            localVue: localVue
        });

        return expect(renderComponent(msg.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly content', () => {
        const msg: Wrapper<MMessage> = mount(MMessage, {
            localVue: localVue,
            slots: {
                default: 'message'
            }
        });

        return expect(renderComponent(msg.vm)).resolves.toMatchSnapshot();
    });

    it('should render nothing if not visible', () => {
        const msg: Wrapper<MMessage> = mount(MMessage, {
            localVue: localVue,
            propsData: {
                visible: false
            }
        });

        return expect(renderComponent(msg.vm)).resolves.toEqual('');
    });

    it('should render correctly light skin', () => {
        const msg: Wrapper<MMessage> = mount(MMessage, {
            localVue: localVue,
            propsData: {
                skin: MMessageSkin.Light
            }
        });

        return expect(renderComponent(msg.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly all possible states', async () => {
        const btn: Wrapper<MMessage> = mount(MMessage, {
            localVue: localVue
        });

        for (const state in MMessageState) {
            btn.setProps({ state: MMessageState[state] });
            expect(await renderComponent(btn.vm)).toMatchSnapshot(state);
        }
    });

    it('should render correctly when there is no icon', () => {
        const msg: Wrapper<MMessage> = mount(MMessage, {
            localVue: localVue,
            propsData: {
                icon: false
            }
        });

        return expect(renderComponent(msg.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly close button when prop is set', () => {
        // For vue-test-utils bug, else m-icon is not rendered in m-button-icon
        Vue.component(ICON_NAME, MIcon);

        const msg: Wrapper<MMessage> = mount(MMessage, {
            localVue: localVue,
            propsData: {
                closeButton: true
            }
        });

        return expect(renderComponent(msg.vm)).resolves.toMatchSnapshot();
    });

    it('should render nothing after close button is clicked', async () => {
        const msg: Wrapper<MMessage> = mount(MMessage, {
            localVue: localVue,
            propsData: {
                closeButton: true
            }
        });

        msg.find('button').trigger('click');
        return expect(renderComponent(msg.vm)).resolves.toEqual('');
    });

    it('should emit close event when close button is clicked', () => {
        const msg: Wrapper<MMessage> = mount(MMessage, {
            localVue: localVue,
            propsData: {
                closeButton: true
            }
        });

        msg.find('button').trigger('click');

        expect(msg.emitted('close')).toBeTruthy();
    });
});
