import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { MENU_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import { MMenuItem } from '../menu-item/menu-item';
import PopupPlugin from '../popup/popup';
import WithRender from './menu.html?style=./menu.scss';

export abstract class BaseMenu extends ModulVue {
}

export interface Menu {
    model: string;
    propOpen: boolean;
    propDisabled: boolean;
    animReady: boolean;
    updateValue(value: string | undefined): void;
    onClick(event: Event, value: string): void;
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
    @Prop()
    public closeOnSelected: boolean;
    @Prop({
        default: Skins.Dark,
        validator: value =>
            value === Skins.Light ||
            value === Skins.Dark
    })
    public skin: Skins;
    @Prop()
    public disabled: boolean;

    public $refs: {
        menu: HTMLElement;
        buttonMenu: HTMLElement;
    };

    public $el: HTMLElement;

    public animReady: boolean = false;
    private internalValue: string | undefined = '';
    private internalOpen: boolean = false;
    private internalDisabled: boolean = false;
    private observer: any;
    private internalItems: MMenuItem[] = [];

    private ariaControls: string = `mMenu-${uuid.generate()}-controls`;

    @Watch('selected')
    public updateValue(value: string | undefined): void {
        this.model = value;
    }

    public onClick(event: Event, value: string): void {
        this.$emit('click', event, value);
    }

    protected mounted(): void {
        this.model = this.selected;
        this.propOpen = this.open;
        this.propDisabled = this.disabled;

        this.$nextTick(() => {
            this.buildItemsMap();
        });

        setTimeout(() => {
            this.animReady = true;
        });
    }

    private buildItemsMap(): void {
        let items: MMenuItem[] = [];
        this.$children.forEach(item => {
            if (item instanceof MMenuItem) {
                if (!item.group) {
                    items.push(item);
                } else {
                    (item as Vue).$children.forEach(groupItem => {
                        if (groupItem instanceof MMenuItem) {
                            items.push(groupItem);
                        }
                    });
                }
            }
        });
        this.internalItems = items;
        this.selectedItem();
    }

    private selectedItem(): void {
        if (this.internalItems) {
            this.internalItems.forEach((item) => {
                if (item.value === this.model) {
                    if (!item.isDisabled) {
                        if (item.groupItemRoot) {
                            item.groupItemRoot.propOpen = true;
                        }
                        item.selected = true;
                    }
                } else if (!item.isDisabled && item.selected) {
                    item.selected = false;
                }
            });
        }
    }

    private closeAllGroupItem(): void {
        if (this.internalItems) {
            this.internalItems.forEach((item) => {
                if (item.groupItemRoot) {
                    item.groupItemRoot.propOpen = false;
                }
            });
        }
    }

    public get model(): any {
        return this.internalValue;
    }

    public set model(value: any) {
        this.internalValue = value;
        this.selectedItem();
        this.$emit('update:selected', value);
        if (this.closeOnSelected) {
            // Add a delay before closing the menu to display the selected item
            setTimeout(() => {
                this.propOpen = false;
            }, 600);
        }
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
        this.animReady = false;
        this.closeAllGroupItem();
        this.selectedItem();
        this.internalOpen = open;
        this.$emit('update:open', open);
        this.animReady = true;
    }

    public get propOpen(): boolean {
        return this.internalOpen;
    }

    private toggleMenu(event: Event): void {
        if (!this.propDisabled) {
            this.propOpen = !this.propOpen;
            this.$refs.buttonMenu.blur();
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
