import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { MTable } from './table';

let wrapper: Wrapper<MTable>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTable);
};

describe(`MTable`, () => {

    it(`Should render correctly`, () => {
        initializeShallowWrapper();

        expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
    });

});
