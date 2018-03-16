import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import WithRender from './viewer.html';

@WithRender
@Component
export class Viewer extends Vue {
    public tag: string = '';
    public items: any[] = [];
    private counter = 0;

    public mounted(): void {
        this.buildTag();
    }

    public addItem(): void {
        this.counter++;
        this.items.push({ id: this.counter, text: `Item #${this.counter}` });
    }

    public getSubItems(item): any {
        if (item.id % 3 === 0) {
            return [{ id: item.id * 1000, text:  `Item #${item.id}.1` }, { id: item.id * 1000, text:  `Item #${item.id}.2` }];
        }
        return [];
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }
}
