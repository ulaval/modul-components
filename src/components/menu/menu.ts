import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { MENU_ITEM_NAME, MENU_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import IconPlugin from '../icon/icon';
import PlusPlugin from '../plus/plus';
import AccordionTransitionPlugin, { MAccordionTransition } from '../transitions/accordion-transition/accordion-transition';
import { MMenuItem } from './menu-item/menu-item';
import WithRender from './menu.html?style=./menu.scss';

export abstract class BaseMenu extends ModulVue {
}

export interface Menu {
    model: string;
    propOpen: boolean;
    propDisabled: boolean;
    animReady: boolean;
    closeOnSelectionInAction: boolean;
    updateValue(value: string | undefined): void;
    onClick(event: Event, value: string): void;
}

export enum MMenuSkin {
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
    @Prop({ default: true })
    public closeOnSelection: boolean;
    @Prop({
        default: MMenuSkin.Dark,
        validator: value =>
            value === MMenuSkin.Light ||
            value === MMenuSkin.Dark
    })
    public skin: MMenuSkin;
    @Prop()
    public disabled: boolean;
    @Prop({ default: `mMenu-${uuid.generate()}-controls` })
    public idAriaControls: string;

    public $refs: {
        menu: HTMLElement;
        buttonMenu: HTMLElement;
        transition: MAccordionTransition
    };

    public animReady: boolean = false;
    public closeOnSelectionInAction: boolean = false;
    private internalValue: string | undefined = '';
    private internalOpen: boolean = false;
    private internalDisabled: boolean = false;
    private internalItems: MMenuItem[] = [];
    private observer: MutationObserver;

    public titleMenuOpen: string = this.$i18n.translate('m-menu:open');
    public titleMenuClose: string = this.$i18n.translate('m-menu:close');

    @Watch('selected')
    public updateValue(value: string | undefined): void {
        this.model = value;
    }

    @Emit('click')
    onClick(event: Event, value: string): void { }

    protected mounted(): void {
        this.model = this.selected;
        this.propOpen = this.open;
        this.propDisabled = this.disabled;

        this.$nextTick(() => {
            this.buildItemsMap();

            this.observer = new MutationObserver(() => {
                this.buildItemsMap();
            });

            if (this.$refs.menu) {
                this.observer.observe(this.$refs.menu, { subtree: true, childList: true });
            }
        });

        setTimeout(() => {
            this.animReady = true;
        });
    }

    private buildItemsMap(): void {
        let items: MMenuItem[] = [];
        this.$refs.transition.$children.forEach(item => {
            if (item instanceof MMenuItem) {
                items.push(item);
                if (item.group) {
                    item.getGroupItem().forEach(groupItem => {
                        groupItem.insideGroup = true;
                        items.push(groupItem);
                    });
                }
            }
        });
        this.internalItems = items;
    }

    private selectedItem(): void {
        if (this.internalItems) {
            this.internalItems.forEach((item) => {
                if (!item.isDisabled) {
                    if (item.value === this.model) {
                        item.selected = true;
                    } else if (item.selected) {
                        item.selected = false;
                    }
                }
            });

            this.internalItems.forEach((item) => {
                if (!item.isDisabled) {
                    if (item.group) {
                        if (!this.open) {
                            item.propOpen = false;
                        }
                        let groupSelected: boolean = false;
                        item.$children.forEach(itemGroup => {
                            if (itemGroup instanceof MMenuItem && itemGroup.selected) {
                                item.propOpen = true;
                                groupSelected = true;
                            }
                        });
                        item.groupSelected = groupSelected;
                    }
                }
            });
        }
    }

    public get model(): any {
        return this.internalValue;
    }

    public set model(value: any) {
        if (!this.closeOnSelectionInAction) {
            this.internalValue = value;
            this.selectedItem();
            this.$emit('update:selected', value);
            if (this.closeOnSelection) {
                this.closeOnSelectionInAction = true;
                // Add a delay before closing the menu to display the selected item
                setTimeout(() => {
                    this.propOpen = false;
                    this.closeOnSelectionInAction = false;
                }, 600);
            }
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
        v.use(AccordionTransitionPlugin);
        v.use(I18nPlugin);
        v.use(PlusPlugin);
        v.use(IconPlugin);
        v.use(IconButtonPlugin);
        v.component(MENU_ITEM_NAME, MMenuItem);
        v.component(MENU_NAME, MMenu);
    }
};

export default MenuPlugin;
