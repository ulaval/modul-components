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

    public mounted(): void {
        this.buildTag();
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }

    private handleDrop(event: MDropEvent): void {
        console.log('handle the drop here plz.', event.dropInfo);
    }

    private getNewItem(actionName: string): MyObject {
        return new MyObject(0, `Hello from ${actionName}`);
    }

    private handleSortableAdd(event: MSortEvent, list: any[]): void {
        list.push(event.sortInfo.data);
    }

    private handleSortableMove(event: MSortEvent, list: any[]): void {
        list.push(event.sortInfo.data);
    }

    private deleteItem(): void {
        this.items.pop();
    }
}
