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

    private items0: string[] = [];
    private items: string[] = 'item 1,item 2,item 3,item 4,opt 1,opt 2, opt 3'.split(',');
    private itemsO: any[] = [
        { v: 'i1', text: 'item o 1' },
        { v: 'i2', text: 'item o 2' },
        { v: 'i3', text: 'item o 3' },
        { v: '01', text: 'opt o 1' },
        { v: '02', text: 'opt o 2' }
    ];
    private items2: string[] = 'item A,item B,item C,item D,item E,item À'.split(',');
    private items3: string[] = 'item Alpha,item Bravo'.split(',');
    private myObj: Choice = new Choice();
    private t: string = '';

    private template: object = {
        template: `<div>
    <m-radio-group ref="g" :position="position" >
        <m-radio ref="a" position="left" value="radio1">Item 1</m-radio>
        <m-radio ref="b" position="right" value="radio2">Item 2</m-radio>
        <m-radio ref="c" value="radio3">Item 3</m-radio>
    </m-radio-group>
</div>`,
        data: function() {
            return {
                position: 'right'
            };
        },
        methods: {
            changePosition: function() {
                this.position = 'right';
            }
        }
    };

    public mounted(): void {
        let meta: string[] = [];
        Meta.getTags().forEach(tag => {
            meta.push(tag);
        });
        this.routes = meta;

        this.myObj.selection = 'item 2';
    }

    private getLabel(item: string): string {
        return `--(${item})--`;
    }
}
