import { createLocalVue, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent } from '../../../tests/helpers/render';
import IconPlugin from '../icon/icon';
import ListItemPlugin, { MListItem } from './list-item';

describe('MDateFields', () => {
    let localVue: VueConstructor<Vue>;
    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(ListItemPlugin);
        Vue.use(IconPlugin);
        addMessages(localVue, ['components/list-item/list-item.lang.en.json']);
    });

    it('should render correctly', () => {
        const li = mount(MListItem, {
            localVue: localVue,
            slots: {
                default: 'item 1'
            }
        });

        return expect(renderComponent(li.vm)).resolves.toMatchSnapshot();
    });

    describe('disabled', () => {
        it('should render correctly', () => {
            const li = mount(MListItem, {
                localVue: localVue,
                propsData: {
                    disabled: true
                }
            });

            return expect(renderComponent(li.vm)).resolves.toMatchSnapshot();
        });

        it('should not render icon', () => {
            const li = mount(MListItem, {
                localVue: localVue,
                propsData: {
                    iconName: 'chip-error',
                    iconHiddenText: 'delete',
                    disabled: true
                }
            });

            return expect(renderComponent(li.vm)).resolves.toMatchSnapshot();
        });

        it('should not render spinner', () => {
            const li = mount(MListItem, {
                localVue: localVue,
                propsData: {
                    waiting: true,
                    disabled: true
                }
            });

            return expect(renderComponent(li.vm)).resolves.toMatchSnapshot();
        });
    });

    it('should render correctly when waiting', () => {
        const li = mount(MListItem, {
            localVue: localVue,
            propsData: {
                waiting: true
            },
            stubs: {
                'm-spinner': '<m-spinner-mock></m-spinner-mock>'
            }
        });

        return expect(renderComponent(li.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when icon is set', () => {
        const li = mount(MListItem, {
            localVue: localVue,
            propsData: {
                iconName: 'chip-error',
                iconHiddenText: 'delete'
            }
        });

        return expect(renderComponent(li.vm)).resolves.toMatchSnapshot();
    });

    it('should emit click event when icon is clicked', () => {
        const li = mount(MListItem, {
            localVue: localVue,
            propsData: {
                iconName: 'chip-error',
                iconHiddenText: 'delete'
            }
        });

        li.find('button').trigger('click');

        expect(li.emitted('click')).toBeTruthy();
    });
});
