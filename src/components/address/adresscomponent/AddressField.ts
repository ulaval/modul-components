import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { FormField } from '../../../utils/form/form-field/form-field';
import { MAutocomplete, MAutoCompleteResult } from '../../autocomplete/autocomplete';
import LoqateFind from '../loqate/LoqateFind';
import LoqateRetrieve from '../loqate/LoqateRetrieve';
import WithRender from './AddressField.html?style=./AddressField.scss';


@WithRender
@Component({
    // @ts-ignore
    components: {
        MAutocomplete
    }
})
export default class AddressField extends Vue {
    @Prop({ default: 'Adresse' })
    private nomAdresse: string;
    @Prop({ default: 'false' })
    private requiredMarquer: boolean;
    @Prop({ required: true })
    private formField: FormField<LoqateRetrieve>;

    private locateFinds: Map<string, LoqateFind>;

    query: string = '';
    retrievedResult?: string = undefined;
    results: MAutoCompleteResult[] = [];

    @Watch('formField.value')
    private onFormFieldChange(newValue: LoqateRetrieve, oldValue: LoqateRetrieve): void {
        if (newValue.countryName.length !== 0) {
            const adresse: string = newValue.adresseFormatted();
            this.retrievedResult = adresse;
            this.query = adresse;
        }
    }

    onAdresseTyped(value: string): Promise<any> | undefined {
        return this.populerAdresse(value);
    }

    onAdresseChange(findId: string): void {
        if (findId.trim().length === 0) {
            this.formField.value = new LoqateRetrieve('', '', '', '', '', '');

            return;
        }

        const loqateFind: LoqateFind | undefined = this.locateFinds.get(findId);
        if (loqateFind && !loqateFind.isAddress()) {
            this.populerAdresse(loqateFind.text, loqateFind.id);
            return;
        }

        if (findId !== this.retrievedResult) { // Pas clean, mais pour éviter que le résulat formmater trigger une autre requête.
            this.$retrieve(findId) // TODO: Pas corriger l'erreur de compile puisque je ne sais pas comment l'interfacer dans module.
                .then((data: LoqateRetrieve[]) => {
                    this.formField.value = data[0];
                });
        }
    }

    private populerAdresse(value: string, container: string = ''): Promise<any> | undefined {
        if (value.trim().length === 0) {
            return undefined;
        }

        return new Promise(resolve => {
            this.$find(value, container) // TODO: Pas corriger l'erreur de compile puisque je ne sais pas comment l'interfacer dans module.
                .then((data: LoqateFind[]) => {
                    this.results = data.map((d: LoqateFind) => {
                        return { label: `${d.text}, ${d.description}`, value: d.id };
                    });

                    this.locateFinds = new Map(data.map(d => [d.id, d] as [string, LoqateFind]));
                    resolve();
                });
        });
    }
}
