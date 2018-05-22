import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

import WithRender from './viewer.html';

@WithRender
@Component
export class Viewer extends Vue {
    public tag: string = '';
    public model: string = '';
    public meta: any = {};
    public data: any = {};

    public mounted(): void {
        this.buildTag();
    }

    public log(): void {
        // tslint:disable-next-line:no-console
        console.log('eheh');
    }

    @Watch('$route')
    private buildTag(): void {
        if (this.$options && this.$options.components && !this.$options.components[`${this.$route.meta}-sandbox`]) {
            this.tag = '<div>No sandbox yet for this component.  Come back later.</div>';
        } else {
            this.tag = `<${this.$route.meta}-sandbox></${this.$route.meta}-sandbox>`;

            const componentName: string = this.$route.meta.replace('m-', '');
            this.meta = require(`../../dist/components/${componentName}/${componentName}.meta.json`);
            if (this.meta.mixins) {
                // tslint:disable-next-line:no-console
                const mixins: any[] = this.meta.mixins.map(mixin => {
                    // tslint:disable-next-line:no-console
                    console.log(this.toKebabCase(mixin));
                    return require(`../../dist/mixins/${this.toKebabCase(mixin)}/${this.toKebabCase(mixin)}.meta.json`);
                });

                mixins.forEach(mixin => {
                    this.meta.attributes = Object.assign(this.meta.attributes, mixin.attributes);
                    this.meta.enums = Object.assign(this.meta.enums, mixin.enums);
                });
                delete this.meta.mixins;
                // tslint:disable-next-line:no-console
                console.log(this.$refs.radio);
            }
        }
    }

    private toKebabCase(param: string): string {
        const upperChars: RegExpMatchArray | null = param.match(/([A-Z])/g);
        if (!upperChars) {
            return param;
        }

        let str: string = param.toString();
        for (let i: number = 0; i < upperChars.length; i++) {
            str = str.replace(new RegExp(upperChars[i]), '-' + upperChars[i].toLowerCase());
        }

        if (str.slice(0, 1) === '-') {
            str = str.slice(1);
        }

        return str;
    }
}
