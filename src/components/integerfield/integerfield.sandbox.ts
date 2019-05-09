import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { INTEGERFIELD_NAME } from '../component-names';
import IntegerfieldPlugin from './integerfield';
import WithRender from './integerfield.sandbox.html';

@WithRender
@Component
export class MIntegerfieldSandbox extends Vue {
    public model1: number = 2;
    public model2: number = 0;
    public model3: number = 3;
    public model4: number = 5;
    public definedModel: any = '';

    get isNumber(): boolean {
        return (typeof this.model1 === 'number');
    }
}

const IntegerfieldSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IntegerfieldPlugin);
        v.component(`${INTEGERFIELD_NAME}-sandbox`, MIntegerfieldSandbox);
    }


};

export default IntegerfieldSandboxPlugin;
