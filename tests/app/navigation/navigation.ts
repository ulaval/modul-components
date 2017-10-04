import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './navigation.html';
import Meta from '../../../src/meta/meta';

class Choice {
    public selection: string;

    constructor() {
        setInterval(() => {
            console.log(this.selection);
        }, 3000);
    }
}

@WithRender
@Component
export class Navigation extends Vue {
    public routes: string[] = [];

    private items: string[] = 'item 1,item 2,item 3,item 4'.split(',');
    private items2: string[] = 'item A,item B,item C,item D'.split(',');
    private myObj: Choice = new Choice();

    private get myCaption(): string {
        console.log('reactive');
        return this.myObj.selection;
    }

    public mounted(): void {
        let meta: string[] = [];
        Meta.getTags().forEach(tag => {
            meta.push(tag);
        });
        this.routes = meta;
    }

    private setItem(): void {
        this.myObj.selection = 'item 4';
    }

    private setItem2(): void {
        this.items = this.items2;
        this.myObj.selection = 'item C';
    }
}
