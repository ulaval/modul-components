import Vue from 'vue';
import '../../utils/polyfills';
import ListItemPlugin, { MListItem } from './list-item';

const DISABLED_CSS: string = 'm--is-disabled';
const WAITING_CSS: string = 'm--is-waiting';

let list: MListItem;

describe('LIST-ITEM', () => {
    beforeEach(() => {
        Vue.use(ListItemPlugin);
        list = new MListItem().$mount();
    });

    it('m--is-disabled class is present when disabled', () => {
        expect(list.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
        list.disabled = true;
        Vue.nextTick(() => {
            expect(list.$el.classList.contains(DISABLED_CSS)).toBeTruthy();
        });
    });

    it('m--is-waiting class is present when waiting props is true', () => {
        expect(list.$el.classList.contains(WAITING_CSS)).toBeFalsy();
        list.waiting = true;
        Vue.nextTick(() => {
            expect(list.$el.classList.contains(WAITING_CSS)).toBeTruthy();
        });
    });

    it('delete button event', () => {
        let clickSpy = jasmine.createSpy('clickSpy');
        let vm = new Vue({
            template: `
                <m-list-item @toDelete="onClick($event)">item 1</m-list-item>
            `,
            methods: {
                onClick: clickSpy
            }
        }).$mount();

        let deleteButton = vm.$el.querySelector('button');

        if (deleteButton) {
            deleteButton.click();
        }

        Vue.nextTick(() => {
            expect(clickSpy).toHaveBeenCalled();
        });
    });

});
