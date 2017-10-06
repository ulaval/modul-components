import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './navigation.html';
import Meta from '../../../src/meta/meta';

class Choice {
    public selection: string = '';

    constructor() {
        setInterval(() => {
            // console.log(this.selection);
        }, 3000);
    }
}

@WithRender
@Component
export class Navigation extends Vue {
    public routes: string[] = [];

    private items0: string[] = [];
    private items: string[] = 'item 1,item 2,item 3,item 4,opt 1,opt 2, opt 3'.split(',');
    private items2: string[] = 'item A,item B,item C,item D,item E'.split(',');
    private items3: string[] = 'item Alpha,item Bravo'.split(',');
    private myObj: Choice = new Choice();
    private t: string = '';

    private get myCaption(): string {
        return this.myObj.selection;
    }

    public mounted(): void {
        let meta: string[] = [];
        Meta.getTags().forEach(tag => {
            meta.push(tag);
        });
        this.routes = meta;
        this.t = 'patate';

        // setTimeout(() => {
        //     this.items = this.items2;
        //     this.myObj.selection = 'item C';
        //     setTimeout(() => {
        //         this.items = this.items3;
        //         this.myObj.selection = 'item Bravo';
        //     }, 5000);
        // }, 3000);
    }

    private setItem(): void {
        this.myObj.selection = 'item 4';
        this.t = '';
    }

    private setItem2(): void {
        if (this.items == this.items2) {
            this.items = this.items0;
        } else {
            this.items = this.items2;
            this.myObj.selection = 'item C';
        }
    }

    private getLabel(item: string): string {
        return `--(${item})--`;
    }
}
