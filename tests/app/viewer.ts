import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import WithRender from './viewer.html';
import { MDropEvent } from '../../src/directives/droppable/droppable';
import { MSortEvent } from '../../src/directives/sortable/sortable';

class MyObject {
    public id: number;
    public text: string;
    public counter: number;

    constructor(id: number, text: string) {
        this.id = id;
        this.text = text;
        this.counter = 0;
    }
}
@WithRender
@Component
export class Viewer extends Vue {
    public tag: string = '';
    public items: any[] = [];
    public items2: any[] = [];
    public items3: any[] = [];
    public newItem: MyObject = new MyObject(this.items.length + this.items2.length + this.items3.length, `Hello from ${this.items.length + this.items2.length + this.items3.length}`);

    public mounted(): void {
        this.buildTag();
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }

    private getNewItem(actionName: string): MyObject {
        return new MyObject(0, `Hello from ${actionName}`);
    }

    private handleSortableAdd(event: MSortEvent, list: any[]): void {
        console.log(event.sortInfo);
        list.splice(event.sortInfo.newPosition, 0, new MyObject(this.items.length + this.items2.length + this.items3.length, `Hello from ${this.items.length + this.items2.length + this.items3.length}`));
        this.refreshNewItem();
    }

    private handleSortableMove(event: MSortEvent, list: any[]): void {
        console.log(event.sortInfo);

        if (event.sortInfo.oldPosition === -1) {
            list.splice(event.sortInfo.newPosition, 0, event.sortInfo.data);
            this.refreshNewItem();
            return;
        }

        if (event.sortInfo.newPosition > event.sortInfo.oldPosition) {
            list.splice(event.sortInfo.newPosition, 0, event.sortInfo.data);
            list.splice(event.sortInfo.oldPosition, 1);
        } else {
            list.splice(event.sortInfo.oldPosition, 1);
            list.splice(event.sortInfo.newPosition, 0, event.sortInfo.data);
        }

        this.refreshNewItem();
    }

    private refreshNewItem(): void {
        this.newItem = new MyObject(this.items.length + this.items2.length + this.items3.length, `Hello from ${this.items.length + this.items2.length + this.items3.length}`);
    }

    private deleteItem(): void {
        this.items.pop();
    }
}
