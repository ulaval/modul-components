import { PluginObject } from 'vue';

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
        (v.prototype as any).$license = new Licenses();
    }
};

export default LicensePlugin;
