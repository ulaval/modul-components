import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { ModulVue } from '../../utils/vue/vue';
import { MENU_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import PopupPlugin from '../popup/popup';
import WithRender from './menu.html?style=./menu.scss';

export abstract class BaseMenu extends ModulVue {
}

export interface Menu {
    model: string;
    updateValue(value: string): void;
    onClick(value: string, event): void;
}

export enum Skins {
    Light = 'light',
    Dark = 'dark'
}

@WithRender
@Component
export class MMenu extends BaseMenu implements Menu {

    @Prop()
    public selected: string;
    @Prop({
        default: Skins.Light,
        validator: value =>
            value === Skins.Light ||
            value === Skins.Dark
    })
    public skin: Skins;
    @Prop()
    public disabled: boolean;

    // model sync gimmick //
    private internalValue: string | undefined = '';

    public get model(): any {
        return this.selected === undefined ? this.internalValue : this.selected;
    }

    public set model(value: any) {
        this.setAndUpdate(value);
        this.$emit('update:selected', value);
    }

    public updateValue(value: any): void {
        this.model = value;
    }

    @Watch('selected')
    public setAndUpdate(value): void {
        this.internalValue = value;
    }

    // @Watch('selected')
    // public isParentGroup(): void {
    //     let selectedChild: Vue | undefined = this.$children.find(element => element.$props.value === this.selected);
    //     if (selectedChild && selectedChild.$props.group || selectedChild && selectedChild.$parent.$props.group) {
    //         this.$emit('open', this.selected);
    //     } else {
    //         this.$emit('close', this.selected);
    //     }
    // }

    ////////////////////////

    public onClick(value: any, event: Event): void {
        this.$emit('click', value, event);
    }

}

const MenuPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(PopupPlugin);
        v.use(I18nPlugin);
        v.use(IconButtonPlugin);
        v.component(MENU_NAME, MMenu);
    }
};

export default MenuPlugin;
