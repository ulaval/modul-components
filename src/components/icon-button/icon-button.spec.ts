import { createLocalVue, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import IconButtonPlugin, { MIconButton, MIconButtonSkin } from './icon-button';

describe('MIconButton', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(IconButtonPlugin);
    });

    it('should render correctly', () => {
        const btn = mount(MIconButton, {
            localVue: localVue
        });

        return expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly selected skin', async () => {
        const btn = mount(MIconButton, {
            localVue: localVue
        });

        for (const skin in MIconButtonSkin) {
            btn.setProps({ skin: MIconButtonSkin[skin] });
            expect(await renderComponent(btn.vm)).toMatchSnapshot(skin);
        }
    });

    it('should render correctly when button size is set', () => {
        const btn = mount(MIconButton, {
            localVue: localVue,
            propsData: {
                buttonSize: '58px'
            }
        });

        return expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly icon name when set', () => {
        const btn = mount(MIconButton, {
            localVue: localVue,
            propsData: {
                iconName: 'clock'
            }
        });

        return expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly icon size when set', () => {
        const btn = mount(MIconButton, {
            localVue: localVue,
            propsData: {
                iconSize: '14px'
            }
        });

        return expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when clicked', () => {
        const btn = mount(MIconButton, {
            localVue: localVue
        });

        btn.find('button').trigger('click');

        expect(btn.emitted('click')).toBeTruthy();
    });
});
