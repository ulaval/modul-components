import { MSortEvent } from './../../src/directives/sortable/sortable';
import { MDropEvent } from './../../src/directives/droppable/droppable';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import WithRender from './viewer.html';

export class MyObject {
    public readonly id: number;
    public text: string;

    constructor(id: number) {
        this.id = id;
        this.text = `Hello from ${ this.id }`;
    }
}

@WithRender
@Component
export class Viewer extends Vue {
    public tag: string = '';
    public items: MyObject[] = [];

    public mounted(): void {
        this.buildTag();
    }

    public changeItem(item: MyObject): void {
        item.text += ' changed';
    }

    public addItem(event: MDropEvent): void {
        this.items.push(new MyObject(this.items.length));
    }

    public moveItem(event: MSortEvent): void {
        this.items.splice(event.sortInfo.oldPosition, 1);
        this.items.splice(event.sortInfo.newPosition, 0, event.sortInfo.data);
    }

    public get newItem(): MyObject {
        return new MyObject(this.items.length);
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }
}
