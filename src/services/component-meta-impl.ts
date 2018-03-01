import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';

// TODO-remove mixin test
@Component
export class ServiceMixin extends Vue {
    public beforeCreate(): void {
        // console.log('before create mixin');
        const options = this.$options;
        (options as any).$serviceMixin = this;
    }

    public log(s: string): void {
        // console.log(s);
    }
}

class GlobalMixin extends Vue {
    public beforeCreate(): void {
        // console.log('before create global mixin');
        // console.log(this.$options);
        (this.$options as any).$aaa = '?';
        (this as any).$globalMixin = 'zz';
    }
}

type GlobalFunc = (s: string) => void;

const f1: GlobalFunc = (s: string) => {
    // console.log('f1', s);
};

const f2: GlobalFunc = (s: string) => {
    // console.log('f2', s);
};

const f3: GlobalFunc = (s: string) => {
    // console.log('f3', s);
};

const ComponentMetaService: PluginObject<any> = {
    install(v, options): void {
        (v as any).$globalF1 = f1;
        (v.prototype as any).$aa = 'aa';
        v.mixin(new GlobalMixin());
        (v.prototype as any).$globalF2 = f2;
    }
};

export default ComponentMetaService;
