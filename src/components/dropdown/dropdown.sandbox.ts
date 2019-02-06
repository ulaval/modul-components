import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { DROPDOWN_NAME } from '../component-names';
import DropdownPlugin from './dropdown';
import WithRender from './dropdown.sandbox.html';

@WithRender
@Component
export class MDropdownSandbox extends ModulVue {
    public nullValue1: string = '4a';
    public nullValue2: string = '5a';
    public nullValue3: string = '6a';
    public undefinedValue1: string = '';
    public undefinedValue2: string = '';
    public undefinedValue3: string = '';
    public numValue: number = 2000;
    public dropdownOpen: boolean = false;

    public numItems: number[] = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007];

    private onOpen(): void {
        this.$log.log('$(\'open\') dropdown');
        this.dropdownOpen = true;

    }

    private onClose(): void {
        this.$log.log('$(\'close\') dropdown');
        this.dropdownOpen = false;
    }
}

const DropdownSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(DropdownPlugin);
        v.component(`${DROPDOWN_NAME}-sandbox`, MDropdownSandbox);
    }
};

export default DropdownSandboxPlugin;
