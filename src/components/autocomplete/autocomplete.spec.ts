import { shallowMount, Wrapper } from '@vue/test-utils';
import { renderComponent } from '../../../tests/helpers/render';
import { MAutocomplete } from './autocomplete';

let wrapper: Wrapper<MAutocomplete>;

const initializeWrapper: () => Wrapper<MAutocomplete> = () => {
    wrapper = shallowMount(MAutocomplete);
    return wrapper;
};

beforeEach(() => {
    initializeWrapper();
});

describe(`m-autocomplete`, () => {
    it(`should render correctly`, () => {
        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });
});
