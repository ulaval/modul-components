import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';

// TODO-remove mixin test
@Component
export class ServiceMixin extends Vue {
    public beforeCreate(): void {
        // Vue.prototype.$log.log('before create mixin');
        const options: any = this.$options;
        options.$serviceMixin = this;
    }

    public log(s: string): void {
        // Vue.prototype.$log.log(s);
    }
}

class GlobalMixin extends Vue {
    public beforeCreate(): void {
        // Vue.prototype.$log.log('before create global mixin');
        // Vue.prototype.$log.log(this.$options);
        (this.$options as any).$aaa = '?';
        (this as any).$globalMixin = 'zz';
    }
}

type GlobalFunc = (s: string) => void;

const f1: GlobalFunc = (s: string) => {
    // Vue.prototype.$log.log('f1', s);
};

const f2: GlobalFunc = (s: string) => {
    // Vue.prototype.$log.log('f2', s);
};

const f3: GlobalFunc = (s: string) => {
    // Vue.prototype.$log.log('f3', s);
};

const ComponentMetaService: PluginObject<any> = {
    install(v, options): void {
        (v as any).$globalF1 = f1;
        (v.prototype).$aa = 'aa';
        v.mixin(new GlobalMixin());
        (v.prototype).$globalF2 = f2;
    }
};

export default ComponentMetaService;
