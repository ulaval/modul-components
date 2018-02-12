import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { renderComponent } from '../../../tests/helpers/render';
import MButtonPlugin, { MButton, MButtonIconPosition, MButtonSkin, MButtonType } from './button';

describe('MButton', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(MButtonPlugin);
    });

    it('should render correctly', () => {
        const btn = mount(MButton, {
            localVue: localVue
        });

        expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when skin is secondary', () => {
        const btn = mount(MButton, {
            localVue: localVue,
            propsData: {
                skin: MButtonSkin.Secondary
            }
        });

        expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled', () => {
        const btn = mount(MButton, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when waiting', () => {
        const btn = mount(MButton, {
            localVue: localVue,
            propsData: {
                waiting: true
            }
        });

        expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    describe('icon', () => {
        let btnWithIcon: Wrapper<MButton>;
        beforeEach(() => {
            btnWithIcon = mount(MButton, {
                localVue: localVue,
                propsData: {
                    iconName: 'default'
                }
            });
        });

        it('should render correctly', () => {
            expect(renderComponent(btnWithIcon.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly when size is set', () => {
            btnWithIcon.setProps({ iconSize: '20px' });
            expect(renderComponent(btnWithIcon.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly position is set to right', () => {
            btnWithIcon.setProps({ iconPosition: MButtonIconPosition.Right });
            expect(renderComponent(btnWithIcon.vm)).resolves.toMatchSnapshot();
        });
    });

    it('should render correctly text content', () => {
        const btn = mount(MButton, {
            localVue: localVue,
            slots: {
                default: 'label'
            }
        });

        expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly precision content', () => {
        const btn = mount(MButton, {
            localVue: localVue,
            slots: {
                precision: 'precision'
            }
        });

        expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should change html element based on type prop', () => {
        const btn = mount(MButton, {
            localVue: localVue
        });

        btn.setProps({ type: MButtonType.Submit });
        expect((btn.element as HTMLButtonElement).type).toEqual('submit');

        btn.setProps({ type: MButtonType.Reset });
        expect((btn.element as HTMLButtonElement).type).toEqual('reset');
    });

    it('should emit click event when clicked', () => {
        const btn = mount(MButton, {
            localVue: localVue
        });

        btn.find('button').trigger('click');

        expect(btn.emitted('click')).toBeTruthy();
    });
});
