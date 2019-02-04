import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export class ModulVue extends Vue {

    protected getParent<T extends Vue>(test: (obj: Vue) => boolean): T | undefined {
        let p: Vue = this.$parent;
        while (p && !test(p)) {
            p = p.$parent;
        }
        return p as any;
    }

    protected as<T>(): T {
        let result: any = this;
        return result as T;
    }
}
