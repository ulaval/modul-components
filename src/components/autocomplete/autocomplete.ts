import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Model, Prop, Watch } from 'vue-property-decorator';
import { AUTOCOMPLETE_NAME } from '../component-names';
import WithRender from './autocomplete.html?style=./autocomplete.scss';

export interface MAutoCompleteResult {
    label: string;
    value: string;
}

@WithRender
@Component
export class MAutoComplete extends Vue {

    @Model('change')
    model: string;

    @Prop({ default: (): [] => [] })
    results: MAutoCompleteResult[];

    @Prop({ default: 250 })
    throttle: number;

    @Prop({ default: 1 })
    minimumChars: number;

    selection: string = '';
    items: MAutoCompleteResult[] = [];
    onInputChangeDebounced: (value: string) => void;

    created(): void {
        this.refreshItemsOnSelectionChange(this.model);
        this.selection = this.model;
        this.onInputChangeDebounced = this.debounce(this.onInputChange, this.throttle);
    }

    @Watch('model')
    public onModelChange(): void {
        this.refreshItemsOnSelectionChange(this.model);
        this.selection = this.model;
    }

    @Watch('selection')
    public onSelection(): void {
        this.refreshItemsOnSelectionChange(this.selection);
        this.$emit('change', this.selection);
    }

    @Watch('results')
    public onResults(): void {
        this.items = this.results;
    }

    private refreshItemsOnSelectionChange(value: string): void {
        let label: string = '';
        const result: MAutoCompleteResult | undefined = this.results.find(r => r.value === value);
        if (result) {
            label = result.label;
        }

        this.items = value !== '' ? [{ label: label, value: value }] : [];
    }

    private onInputChange(value: string): void {
        if (value === '') {
            this.items = [];
        } else if (value.length >= this.minimumChars) {
            this.$emit('complete', value);
        }
    }

    private debounce(fn: (value: string) => void, wait: number): (value: string) => void {
        let timeout: any;
        return (value: string) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = undefined;
                fn(value);
            }, wait);
        };
    }
}

const AutoCompletePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(AUTOCOMPLETE_NAME, 'plugin.install');
        v.component(AUTOCOMPLETE_NAME, MAutoComplete);
    }
};

export default AutoCompletePlugin;
