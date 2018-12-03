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
        const btn: Wrapper<MButton> = mount(MButton, {
            localVue: localVue
        });

        return expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when skin is secondary', () => {
        const btn: Wrapper<MButton> = mount(MButton, {
            localVue: localVue,
            propsData: {
                skin: MButtonSkin.Secondary
            }
        });

        return expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when disabled', () => {
        const btn: Wrapper<MButton> = mount(MButton, {
            localVue: localVue,
            propsData: {
                disabled: true
            }
        });

        return expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when waiting', () => {
        const btn: Wrapper<MButton> = mount(MButton, {
            localVue: localVue,
            propsData: {
                waiting: true
            }
        });

        return expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
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
            return expect(renderComponent(btnWithIcon.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly when size is set', () => {
            btnWithIcon.setProps({ iconSize: '20px' });
            return expect(renderComponent(btnWithIcon.vm)).resolves.toMatchSnapshot();
        });

        it('should render correctly position is set to right', () => {
            btnWithIcon.setProps({ iconPosition: MButtonIconPosition.Right });
            return expect(renderComponent(btnWithIcon.vm)).resolves.toMatchSnapshot();
        });
    });

    it('should render correctly text content', () => {
        const btn: Wrapper<MButton> = mount(MButton, {
            localVue: localVue,
            slots: {
                default: 'label'
            }
        });

        return expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly precision content', () => {
        const btn: Wrapper<MButton> = mount(MButton, {
            localVue: localVue,
            slots: {
                precision: 'precision'
            }
        });

        return expect(renderComponent(btn.vm)).resolves.toMatchSnapshot();
    });

    it('should change html element based on type prop', () => {
        const btn: Wrapper<MButton> = mount(MButton, {
            localVue: localVue
        });

        btn.setProps({ type: MButtonType.Submit });
        expect((btn.element as HTMLButtonElement).type).toEqual('submit');

        btn.setProps({ type: MButtonType.Reset });
        expect((btn.element as HTMLButtonElement).type).toEqual('reset');
    });

    it('should emit click event when clicked', () => {
        const btn: Wrapper<MButton> = mount(MButton, {
            localVue: localVue
        });

        btn.find('button').trigger('click');

        expect(btn.emitted('click')).toBeTruthy();
    });
});
