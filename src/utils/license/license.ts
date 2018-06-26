import { PluginObject } from 'vue';

class License<TLicense> {
    constructor(public id: any, public value: TLicense) {}
}

export class Licenses {
    protected static licenses: License<any>[] = [];

    public addLicense<TLicense>(id: any, value: TLicense): void {
        Licenses.licenses.push(new License(id, value));
    }

    public getLicense<TLicense>(id: any): TLicense | undefined {
        return (Licenses.licenses.find(license => license.id === id) || {} as any).value;
    }
}

const LicensePlugin: PluginObject<any> = {
    install(v): void {
        (v.prototype as any).$license = new Licenses();
    }
};

export default LicensePlugin;
