import { PluginObject } from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        $license: Licenses;
    }
}
export class Licenses {
    protected static licenses: { [key: string]: any } = {};

    public addLicense<TLicense>(id: any, value: TLicense): void {
        Licenses.licenses[id] = value;
    }

    public getLicense<TLicense>(id: any): TLicense | undefined {
        return Licenses.licenses[id];
    }
}

const LicensePlugin: PluginObject<any> = {
    install(v): void {
        (v.prototype).$license = new Licenses();
    }
};

export default LicensePlugin;
