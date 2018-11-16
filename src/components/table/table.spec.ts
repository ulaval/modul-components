import { shallow, Wrapper } from '@vue/test-utils';

import { renderComponent } from '../../../tests/helpers/render';
import { MColumnTable, MTable } from './table';

let slots: any = {};
const SLOT_EMPTY: string = '<td>EMPTY</td>';
const SLOT_HEADER: string = '<thead><tr><th>SLOT THEAD</th></tr></thead>';
const SLOT_TH: string = '<th>SLOT TH</th>';
const SLOT_BODY: string = '<tbody><tr><td>SLOT BODY</td></tr></tbody>';
const SLOT_TD: string = '<td>SLOT TD</td>';
const SLOT_FOOTER: string = '<td>SLOT FOOTER</td>';

let rows: any [] = [];

const columns: MColumnTable[] = [
    { id: 'a', title: 'A', dataProp: 'a', width: '10%' },
    { id: 'b', title: 'B', dataProp: 'b' }
];

const EMPTY_DATA: any[] = [];
const DATA: any[] = [
    { id: '1', a: 'a1', b: 'b1' },
    { id: '2', a: 'a2', b: 'b2' }
];

let wrapper: Wrapper<MTable>;

const initializeShallowWrapper: any = () => {
    wrapper = shallow(MTable, {
        propsData: {
            rows,
            columns
        },
        slots
    });
};

describe(`MTable`, () => {

    describe(`Given an empty table`, () => {

        beforeEach(() => {
            rows = EMPTY_DATA;
        });

        it(`Then should be empty`, () => {
            initializeShallowWrapper();

            expect(wrapper.vm.isEmpty).toBeTruthy();
        });

        describe(`When a custom slot is given`, () => {
            it(`Then should render correctly`, () => {
                slots = {
                    'empty': SLOT_EMPTY
                };
                initializeShallowWrapper();

                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });

        describe(`When we use the default template`, () => {
            it(`Then should render correctly`, () => {
                slots = {};
                initializeShallowWrapper();

                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });

    });

    describe(`Given a table full of data`, () => {

        beforeEach(() => {
            rows = DATA;
        });

        it(`Then should not be empty`, () => {
            initializeShallowWrapper();

            expect(wrapper.vm.isEmpty).toBeFalsy();
        });

        describe(`When we don't use slots`, () => {
            it(`Then should render correctly`, () => {
                slots = {};
                initializeShallowWrapper();

                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });

        describe(`When using slot to replace the header`, () => {
            it(`Then should render correctly`, () => {
                slots = {
                    'header': SLOT_HEADER
                };
                initializeShallowWrapper();

                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });

        describe(`When using slot to replace a th`, () => {
            it(`Then should render correctly`, () => {
                slots = {
                    'header.a': SLOT_TH
                };
                initializeShallowWrapper();

                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });

        describe(`When using slot to replace the tbody`, () => {
            it(`Then should render correctly`, () => {
                slots = {
                    'body': SLOT_BODY
                };
                initializeShallowWrapper();

                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });

        describe(`When using slot to replace a td`, () => {
            it(`Then should render correctly`, () => {
                slots = {
                    'body.a': SLOT_TD
                };
                initializeShallowWrapper();

                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });

        describe(`When using a footer`, () => {
            it(`Then should render correctly`, () => {
                slots = {
                    'footer': SLOT_FOOTER
                };
                initializeShallowWrapper();

                expect(renderComponent(wrapper.vm)).resolves.toMatchSnapshot();
            });
        });

    });

    describe(`Given a column`, () => {

        describe(`When the width is specified`, () => {
            it(`Then should be the right width`, () => {
                initializeShallowWrapper();

                expect(wrapper.vm.columnWidth(columns[0])).toEqual({ width: '10%' });
            });
        });

        describe(`When the width is undefined`, () => {
            it(`Then should be the right width`, () => {
                initializeShallowWrapper();

                expect(wrapper.vm.columnWidth(columns[1])).toEqual('');
            });
        });

    });

});
