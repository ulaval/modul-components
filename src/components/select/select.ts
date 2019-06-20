import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { MediaQueries } from '../../mixins/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { SELECT_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import { MSelectItem } from './select-item/select-item';
import WithRender from './select.html?style=./select.scss';


@WithRender
@Component({
    components: {
        MSelectItem
    },
    mixins: [
        InputState,
        MediaQueries,
        InputManagement,
        InputWidth,
        InputLabel
    ]
})
export class MSelect extends ModulVue {

    @Model('input')
    @Prop()
    public value: any;

    @Prop()
    public options: any[];

    private internalOpen: boolean = false;

    private id: string = `${SELECT_NAME}-${uuid.generate()}`;


    private get ariaControls(): string {
        return this.id + '-controls';
    }

    private get hasItems(): boolean {
        return this.options && this.options.length > 0;
    }

    public get isEmpty(): boolean {
        return this.as<InputManagement>().hasValue || (this.open) ? false : true;
    }

    private get open(): boolean {
        return this.internalOpen;
    }

    private set open(open: boolean) {
        if (this.as<InputState>().active) {
            this.internalOpen = open;
        }
    }

    select(option: any, index: number): void {
        this.as<InputManagement>().model = this.options[index];
        this.open = false;
    }

    isSelected(option: any): boolean {
        return this.as<InputManagement>().internalValue.indexOf(option) > -1;
    }

    @Emit('open')
    private onOpen(): void { }

    @Emit('close')
    private onClose(): void { }

    @Emit('portal-content-visible')
    private onPortalContentVisible(): void { }
}

const SelectPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(I18nPlugin);
        v.component(SELECT_NAME, MSelect);
    }
};

export default SelectPlugin;
