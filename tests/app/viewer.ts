import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import WithRender from './viewer.html?style=./viewer.scss';
import { MDropEvent } from '../../src/directives/droppable/droppable';
import { MSortEvent } from '../../src/directives/sortable/sortable';

class MyObject {
    public id: number;
    public text: string;
    public counter: number;
    public grouping: any;
    public items: MyObject[] = [];

    constructor(id: number, text: string, grouping?: any) {
        this.id = id;
        this.text = text;
        this.counter = 0;
        this.grouping = grouping;
    }
}
@WithRender
@Component
export class Viewer extends Vue {
    public tag: string = '';
    public items: any[] = [];
    public items2: any[] = [];
    public items3: any[] = [];
    public newItem: MyObject;
    public groupingCount = 1;
    public itemCount = 1;
    public dummyText = 'Drag any';
    public dummyData = {};
    public eventCounter = 0;

    public mounted(): void {
        this.buildTag();
        window.addEventListener('touchmove', () => {});
        this.refreshNewItem();
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }

    private changeText(): void {
        this.dummyText += '1';
    }

    private changeDummyData(): void {
        this.dummyData = { text: 'lol' };
    }

    private doSomething(event: Event): void {
    }

    private getNewItem(actionName: string): MyObject {
        return new MyObject(0, `Hello from ${actionName}`);
    }

    private handleSortableAdd(event: MSortEvent, list: any[]): void {
        event.stopImmediatePropagation();

        const id: number = this.itemCount++;
        switch (event.sortInfo.action) {
            case 'addGrouping':
                list.splice(event.sortInfo.newPosition, 0, new MyObject(id, `Hello from ${id}`, this.groupingCount++));
                this.refreshNewItem();
                break;
            default:
                list.splice(event.sortInfo.newPosition, 0, new MyObject(id, `Hello from ${id}`, event.sortInfo.grouping));
                this.refreshNewItem();
        }
    }

    private handleSortableMove(event: MSortEvent, list: any[]): void {
        event.stopImmediatePropagation();
        console.log(event.sortInfo);

        event.sortInfo.data.grouping = event.sortInfo.grouping;
        if (event.sortInfo.oldPosition === -1) {
            list.splice(event.sortInfo.newPosition, 0, event.sortInfo.data);
            this.refreshNewItem();
            return;
        }

        list.splice(event.sortInfo.oldPosition, 1);
        list.splice(event.sortInfo.newPosition, 0, event.sortInfo.data);

        this.refreshNewItem();
    }

    private handleSortableRemove(event: MSortEvent, list: any[]): void {
        event.stopImmediatePropagation();
        list.splice(event.sortInfo.oldPosition, 1);
    }

    private refreshNewItem(): void {
        this.newItem = new MyObject(this.items.length + this.items2.length + this.items3.length, `Hello from ${this.items.length + this.items2.length + this.items3.length}`, this.groupingCount);
    }

    private deleteItem(): void {
        this.items.pop();
    }

    private log(message, data: Event): void {
        data.preventDefault();
        data.stopPropagation();
        data.stopImmediatePropagation();
        // console.clear();
        // console.log(message, this.eventCounter++, data);
    }

    private dragEnter(event: DragEvent, sendMessage: boolean): void {
        event.preventDefault();
        // (document.getElementById('messageSortable2') as HTMLElement).innerText = 'enter from viewer';
        if (sendMessage) { (document.getElementById('messageSortable2') as HTMLElement).innerText = 'enter'; }
    }

    private dragLeave(event: DragEvent, sendMessage: boolean): void {
        if (sendMessage) { (document.getElementById('messageSortable2') as HTMLElement).innerText = 'leave'; }
        // (document.getElementById('messageSortable2') as HTMLElement).innerText = 'exit from viewer';
    }

    private dragOver(event: DragEvent, flag: boolean): void {
        if (flag) { event.preventDefault(); }
    }
}
