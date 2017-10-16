import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './navigation.html';
import Meta from '../../../src/meta/meta';

class Choice {
    public selection: any = '';

    constructor() {
        setInterval(() => {
            // console.log(this.selection);
            // console.log(document.activeElement);
        }, 3000);
    }
}

@WithRender
@Component
export class Navigation extends Vue {
    public routes: string[] = [];

    public mounted(): void {
        let meta: string[] = [];
        Meta.getTags().forEach(tag => {
            meta.push(tag);
        });
        this.routes = meta;
    }
}
