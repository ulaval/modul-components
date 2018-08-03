import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { MENU_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import { MenuItem, MMenuItem } from '../menu-item/menu-item';
import PopupPlugin from '../popup/popup';
import WithRender from './menu.html?style=./menu.scss';

export abstract class BaseMenu extends ModulVue {
}

export interface Menu {
    model: string;
    propOpen: boolean;
    propDisabled: boolean;
    groupSelectioned: MenuItem | undefined;
    isAnimReady: boolean;
    updateValue(value: string | undefined): void;
    onClick(event: Event, value: string): void;
    closeAllGroup(): void;
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
    @Prop()
    public open: boolean;
    @Prop({
        default: Skins.Dark,
        validator: value =>
            value === Skins.Light ||
            value === Skins.Dark
    })
    public skin: Skins;
    @Prop()
    public disabled: boolean;

    public groupSelectioned: MenuItem | undefined;
    public animReady: boolean = false;
    private internalValue: string | undefined = '';
    private internalOpen: boolean = false;
    private internalDisabled: boolean = false;
    private itemSelectioned: MMenuItem;

    private ariaControls: string = `mMenu-${uuid.generate()}`;

    @Watch('selected')
    public updateValue(value: string | undefined): void {
        this.model = value;
    }

    public onClick(event: Event, value: string): void {
        this.$emit('click', event, value);
    }

    public closeAllGroup(isAnimReady: boolean = true): void {
        this.$children.forEach((menuItem: MMenuItem) => {
            if (menuItem.$options.name === 'MMenuItem' && menuItem.group) {
                menuItem.propOpen = false;
            }
        });
    }

    public set isAnimReady(animReady: boolean) {
        if (animReady) {
            setTimeout(() => {
                this.animReady = true;
            }, 300);
        } else {
            this.animReady = false;
        }
    }

    public get isAnimReady(): boolean {
        return this.animReady;
    }

    protected mounted(): void {
        this.model = this.selected;
        this.propOpen = this.open;
        this.propDisabled = this.disabled;
        this.isAnimReady = true;
    }

    public get model(): any {
        return this.internalValue;
    }

    public set model(value: any) {
        this.internalValue = value;
        this.$emit('update:selected', value);
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    @Watch('disabled')
    private disabledChanged(disabled: boolean): void {
        this.propDisabled = disabled;
    }

    public set propDisabled(disabled: boolean) {
        this.internalDisabled = disabled;
    }

    public get propDisabled(): boolean {
        return this.internalDisabled;
    }

    public set propOpen(open: boolean) {
        this.isAnimReady = false;
        if (open) {
            this.closeAllGroup(false);
            if (this.groupSelectioned) {
                this.groupSelectioned.propOpen = true;
            }
        }
        this.internalOpen = open;
        this.$emit('update:open', open);
        this.isAnimReady = true;
    }

    public get propOpen(): boolean {
        return this.internalOpen;
    }

    private toggleMenu(event: Event): void {
        if (!this.propDisabled) {
            this.propOpen = !this.propOpen;
            (this.$refs.buttonMenu as HTMLElement).blur();
            this.onClick(event, '');
        }
    }

    private get hasSlotTrigger(): boolean {
        return !!this.$slots.trigger;
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
