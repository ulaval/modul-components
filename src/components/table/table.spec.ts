import Vue from 'vue';
import '../../utils/polyfills';
import TablePlugin, { MTable, MTableHeaderPosition } from './table';

const HEADER_CSS: string = 'm--has-header';
const OPTION_MENU_CSS: string = 'm--has-option-menu';

let table: MTable;

describe('MTableHeaderPosition', () => {
    it('validates enum', () => {
        expect(MTableHeaderPosition.Left).toEqual('header-left');
        expect(MTableHeaderPosition.Right).toEqual('header-right');
    });
});

describe('table', () => {
    beforeEach(() => {
        Vue.use(TablePlugin);
        table = new MTable().$mount();
    });

    it('css class for table are not present', () => {
        expect(table.$el.classList.contains(OPTION_MENU_CSS)).toBeFalsy();
        expect(table.$el.classList.contains(HEADER_CSS)).toBeFalsy();
    });

    it('withOptionsMenu prop', () => {
        expect(table.$el.classList.contains(OPTION_MENU_CSS)).toBeFalsy();
        table.withOptionsMenu = true;
        Vue.nextTick(() => {
            expect(table.$el.classList.contains(OPTION_MENU_CSS)).toBeTruthy();
            table.withOptionsMenu = false;
            Vue.nextTick(() => {
                expect(table.$el.classList.contains(OPTION_MENU_CSS)).toBeFalsy();
            });
        });
    });

});
