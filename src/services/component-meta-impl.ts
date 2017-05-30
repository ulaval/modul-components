import { PluginObject } from 'vue';
import Vue from 'vue';

import Component from 'vue-class-component';

// TODO-remove mixin test
@Component
export class ServiceMixin extends Vue {
    public beforeCreate(): void {
        const options = this.$options;
        (options as any).$serviceMixin = this;
    }

    public log(s: string): void {
        console.log(s);
    }
}

class GlobalMixin extends Vue {
    public beforeCreate(): void {
        console.log(this.$options);
        (this.$options as any).$aaa = '?';
        (this as any).$globalMixin = 'zz';
    }
}

class GlobalFunc {
    public log(s: string): void {
        console.log('global', s);
    }
}

export class ComponentMetaService implements PluginObject<any> {
    public install(v, options) {
        v.prototype.$aa = 'aa';
        v.mixin(new GlobalMixin());
        v.prototype.$globalFunc = new GlobalFunc();
    }
}

export default new ComponentMetaService();
