import { createLocalVue, mount, Slots, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import { resetModulPlugins } from '../../../tests/helpers/component';
import { addMessages } from '../../../tests/helpers/lang';
import { getDefaultMock } from '../../../tests/helpers/mock';
import { renderComponent } from '../../../tests/helpers/render';
import uuid from '../../utils/uuid/uuid';
import DropdownPlugin, { MDropdown } from './dropdown';
import ModulPlugin from '../../utils/modul/modul';


jest.mock('../../utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');

describe('MDropdown', () => {
    let localVue: VueConstructor<Vue>;
    let mockPopper: VueConstructor<Vue>;

    beforeEach(() => {
        resetModulPlugins();
        localVue = createLocalVue();
        // localVue.use(ModulPlugin);
        // localVue.use(DropdownPlugin);
        mockPopper = localVue.component('m-popper', {
            template: '<m-popper-mock><slot name="footer"></slot></m-popper-mock>'
        });
        addMessages(localVue, [
            'components/dropdown/dropdown.lang.en.json'
        ]);
    });

    it('should render correctly', () => {
        const dropdown: Wrapper<MDropdown> = mount(MDropdown, {
            mocks: getDefaultMock(),
            localVue: localVue
        });

        return expect(dropdown.html()).toMatchSnapshot();
    });

    it('should render correctly when placeholder is set', () => {
        const dropdown: Wrapper<MDropdown> = mount(MDropdown, {
            mocks: getDefaultMock(),
            localVue: localVue,
            propsData: {
                placeholder: 'placeholder test'
            }
        });

        return expect(dropdown.html()).toMatchSnapshot();
    });

    // it('should render correctly when footer slot is set', () => {
    //     Vue.component('m-popper', mockPopper);
    //     const dropdown: Wrapper<MDropdown> = mount(MDropdown, {
    //         mocks: getDefaultMock(),
    //         localVue: localVue,
    //         slots: {
    //             footer: '<div>footer-content</div>'
    //         }
    //     });
    //     return expect(renderComponent(dropdown.vm)).resolves.toMatchSnapshot();
    // });

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

    const mountGroup: (propsData?: object, slots?: Slots) => Wrapper<MDropdown> = (propsData?: object, slots?: Slots) => {
        return mount(MDropdown, {
            mocks: getDefaultMock(),
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
