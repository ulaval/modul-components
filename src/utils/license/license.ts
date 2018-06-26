import { PluginObject } from 'vue';

class License<TLicense> {
    constructor(public id: any, public value: TLicense) {}
}

export class Licenses {
    protected static licenses: Map<string, any> = new Map<string, any>();

    public addLicense<TLicense>(id: any, value: TLicense): void {
        Licenses.licenses.set(id, value);
    }

    public getLicense<TLicense>(id: any): TLicense | undefined {
        return Licenses.licenses.get(id);
    }
}

const LicensePlugin: PluginObject<any> = {
    install(v): void {
        (v.prototype as any).$license = new Licenses();
    }
};

export default LicensePlugin;
