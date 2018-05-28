import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { PHONE_NUMBER_NAME } from '../component-names';
import WithRender from './phone-number.sandbox.html';

@WithRender
@Component
export class MPhoneNumberSandbox extends Vue {
}

const PhoneNumberSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${PHONE_NUMBER_NAME}-sandbox`, MPhoneNumberSandbox);
    }
};

export default PhoneNumberSandboxPlugin;
