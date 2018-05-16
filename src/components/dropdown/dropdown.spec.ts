import { mount, Slots, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { addMessages } from '../../../tests/helpers/lang';
import { renderComponent, WrapChildrenStub } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import { MIconButton } from '../icon-button/icon-button';
import DropdownPlugin, { MDropdown } from './dropdown';

jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MDropdown', () => {
    let localVue: VueConstructor<Vue>;

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(DropdownPlugin);
        addMessages(Vue, [
            'components/dropdown/dropdown.lang.en.json'
        ]);
    });

    it('should render correctly', () => {
        const dropdown = mount(MDropdown, {
            localVue: Vue
        });

        return expect(renderComponent(dropdown.vm)).resolves.toMatchSnapshot();
    });

    it('should render correctly when placeholder is set', () => {
        const dropdown = mount(MDropdown, {
            localVue: Vue,
            propsData: {
                placeholder: 'placeholder test'
            }
        });

        return expect(renderComponent(dropdown.vm)).resolves.toMatchSnapshot();
    });

    // Need to be improve
    // it('should render correctly when its open', () => {
    //     const dropdown = mount(MDropdown, {
    //         localVue: Vue,
    //         propsData: {
    //             filterable: true
    //         },
    //         slots: {
    //             default: `<m-dropdown-item value="a">A item</m-dropdown-item>
    //                       <m-dropdown-item value="b">B item</m-dropdown-item>
    //                       <m-dropdown-item value="c">C item</m-dropdown-item>`
    //         },
    //         stubs: {
    //             'm-popup': WrapChildrenStub('div')
    //         }
    //     });

    //     return expect(renderComponent(dropdown.vm)).resolves.toMatchSnapshot();
    // });

    const mountGroup = (propsData?: object, slots?: Slots) => {
        return mount(MDropdown, {
            propsData: propsData,
            slots: {
                default: `<m-dropdown>
                            <m-dropdown-item value="a">A item</m-dropdown-item>
                            <m-dropdown-item value="b">B item</m-dropdown-item>
                            <m-dropdown-item value="c">C item</m-dropdown-item>
                          </m-dropdown>`,
                ...slots
            }
        });
    };
});
