import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { AUTOCOMPLETE_NAME } from '../component-names';
import AutoCompletePlugin, { MAutoCompleteResult } from './autocomplete';
import WithRender from './autocomplete.sandbox.html';

@WithRender
@Component
export class MAutoCompleteSandbox extends ModulVue {
    results: MAutoCompleteResult[] = [{ label: 'RandomDog', value: 'RandomDog' }];
    results2: MAutoCompleteResult[] = [];
    selection: string = 'RandomDog';
    selection2: string = '';

    private onComplete(value: string): void {
        this.onCompleteFetch(value).then((results: MAutoCompleteResult[]) => {
            this.results = results;
        });
    }

    private onComplete2(value: string): void {
        this.onCompleteFetch(value).then((results: MAutoCompleteResult[]) => {
            this.results2 = results;
        });
    }

    private onCompleteFetch(value: string): Promise<MAutoCompleteResult[]> {
        return fetch('https://api.publicapis.org/entries?title=' + value)
            .then(res => res.json())
            .then((res: any) => {
                if (res.count > 0) {
                    return res.entries.filter(entry => entry.API.toLowerCase().indexOf(value.toLowerCase()) === 0).map(entry => {
                        const label: string = entry.API.length > 60
                            ? entry.API.slice(0, 60) + '...'
                            : entry.API;
                        return { label: label, value: label, entry: entry };
                    });
                } else {
                    return [];
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
