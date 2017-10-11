import Vue from 'vue';
import '../../utils/polyfills';
import StatusPlugin, { MStatus, MStatusListStates } from './status';

const COMPLETED_CSS: string = 'm--is-completed';
const PENDING_CSS: string = 'm--is-pending';
const ERROR_CSS: string = 'm--is-error';

let component: MStatus;

describe('M-STATUS', () => {
    beforeEach(() => {
        Vue.use(StatusPlugin);
        component = new MStatus().$mount();
    });

    it('m--is-completed class is present when status is completed', () => {
        expect(component.$el.classList.contains(COMPLETED_CSS)).toBeFalsy();
        component.status = MStatusListStates.Completed;
        Vue.nextTick(() => {
            expect(component.$el.classList.contains(COMPLETED_CSS)).toBeTruthy();
        });
    });

    it('m--is-pending class is present when status is pending', () => {
        expect(component.$el.classList.contains(PENDING_CSS)).toBeFalsy();
        component.status = MStatusListStates.Pending;
        Vue.nextTick(() => {
            expect(component.$el.classList.contains(PENDING_CSS)).toBeTruthy();
        });
    });

    it('m--is-error class is present when status is error', () => {
        expect(component.$el.classList.contains(ERROR_CSS)).toBeFalsy();
        component.status = MStatusListStates.Error;
        Vue.nextTick(() => {
            expect(component.$el.classList.contains(ERROR_CSS)).toBeTruthy();
        });
    });
});
