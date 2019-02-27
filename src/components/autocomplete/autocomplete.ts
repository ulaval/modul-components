import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import { InputStateTagStyle } from '../../mixins/input-state/input-state';
import { InputMaxWidth } from '../../mixins/input-width/input-width';
import { Enums } from '../../utils/enums/enums';
import { ModulVue } from '../../utils/vue/vue';
import { AUTOCOMPLETE_NAME } from '../component-names';
import DropdownPlugin from '../dropdown/dropdown';
import WithRender from './autocomplete.html?style=./autocomplete.scss';

export interface MAutoCompleteResult {
    label: string;
    value: string;
}

@WithRender
@Component
export class MAutocomplete extends ModulVue {

    @Model('change')
    model: string;
    @Prop({ default: (): [] => [] })
    results: MAutoCompleteResult[];
    @Prop({ default: 250 })
    throttle: number;
    @Prop({ default: 1 })
    minimumChars: number;

    @Prop()
    placeholder: string;
    @Prop()
    focus: boolean;
    @Prop()
    disabled: boolean;
    @Prop()
    errorMessage: string;
    @Prop()
    validMessage: string;
    @Prop()
    helperMessage: string;
    @Prop({ default: '100%' })
    width: string;
    @Prop({ default: InputMaxWidth.Regular })
    maxWidth: string;
    @Prop()
    label: string;
    @Prop()
    requiredMarker: boolean;
    @Prop({
        default: InputStateTagStyle.Default,
        validator: value => Enums.toValueArray(InputStateTagStyle).indexOf(value) !== -1
    })
    tagStyle: string;

    selection: string = '';
    items: MAutoCompleteResult[] = [];
    throttleTimeout: any;

    created(): void {
        this.refreshItemsOnSelectionChange(this.model);
        this.selection = this.model;
    }

    @Watch('model')
    onModelChange(): void {
        this.refreshItemsOnSelectionChange(this.model);
        this.selection = this.model;
    }

    @Emit('change')
    @Watch('selection')
    onSelection(): string {
        this.refreshItemsOnSelectionChange(this.selection);
        return this.selection;
    }

    @Watch('results')
    onResults(): void {
        this.items = this.results;
    }

    onInputChangeThrottled(value: string): void {
        clearTimeout(this.throttleTimeout);
        this.throttleTimeout = setTimeout(() => {
            this.throttleTimeout = undefined;
            this.onInputChange(value);
        }, this.throttle);
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
            this.emitComplete(value);
        }
    }

    @Emit('complete')
    private emitComplete(value: string): string {
        return value;
    }
}

const AutoCompletePlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(AUTOCOMPLETE_NAME, 'plugin.install');
        v.use(DropdownPlugin);
        v.component(AUTOCOMPLETE_NAME, MAutocomplete);
    }
};

export default AutoCompletePlugin;
