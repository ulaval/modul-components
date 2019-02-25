import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { AUTOCOMPLETE_NAME } from '../component-names';
import AutoCompletePlugin, { MAutoCompleteResult } from './autocomplete';
import WithRender from './autocomplete.sandbox.html';

@WithRender
@Component
export class MAutoCompleteSandbox extends ModulVue {
    results: MAutoCompleteResult[] = [{ label: 'RandomDog', value: '1' }];
    selection: string = '1';
    id: number = 0;

    private onComplete(value: string): void {
        fetch('https://api.publicapis.org/entries?title=' + value)
            .then(res => res.json())
            .then((res: any) => {
                if (res.count > 0) {
                    this.results = res.entries.map(entry => {
                        const label: string = entry.API.length > 60
                            ? entry.API.slice(0, 60) + '...'
                            : entry.API;
                        return { label: label, value: this.id++ };
                    });
                } else {
                    this.results = [];
                }
            });
    }
}

const AutoCompleteSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(AutoCompletePlugin);
        v.component(`${AUTOCOMPLETE_NAME}-sandbox`, MAutoCompleteSandbox);
    }
};

export default AutoCompleteSandboxPlugin;
