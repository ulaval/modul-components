import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { SEARCHFIELD_NAME } from '../component-names';
import InputStyle from '../input-style/input-style';
import ValidationMesagePlugin from '../validation-message/validation-message';
import WithRender from './searchfield.html';
import './searchfield.scss';

@WithRender
@Component({
    mixins: [
        InputState,
        InputWidth,
        InputLabel,
        InputManagement
    ]
})
export class MSearchfield extends ModulVue {
    public id: string = `mSearchfield-${uuid.generate()}`;
    public searchIconDescription: string = this.$i18n.translate('m-textfield:search');

    public reset(): void {
        this.emitNewValue('');
    }

    public onSearch(event: KeyboardEvent | MouseEvent): void {
        this.search(this.model);
    }

    private get model(): string {
        return this.as<InputManagement>().value;
    }

    private set model(value: string) {
        this.emitNewValue(value);
    }

    private get hasSearchfieldError(): boolean {
        return this.as<InputState>().hasError;
    }

    private get isSearchfieldValid(): boolean {
        return this.as<InputState>().isValid;
    }

    @Emit('input')
    private emitNewValue(newValue?: string): void { }

    @Emit('search')
    private search(model: string): void { }
}

const SearchfieldPlugin: PluginObject<any> = {
    install(v): void {
        v.use(InputStyle);
        v.use(ValidationMesagePlugin);
        v.component(SEARCHFIELD_NAME, MSearchfield);
    }
};

export default SearchfieldPlugin;
