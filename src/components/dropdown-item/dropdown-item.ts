import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown-item.html?style=./dropdown-item.scss';
import { DROPDOWN_ITEM_NAME } from '../component-names';
import { normalizeString } from '../../utils/str/str';
import { MDropdownGroupInterface } from '../dropdown-group/dropdown-group';

export interface MDropdownInterface extends Vue {
    model: any;
    items: Vue[];
    inactive: boolean;
    // nbItemsVisible: number;
    filter(text: string | undefined): boolean;
    setFocus(item: Vue): void;
    toggleDropdown(open: boolean): void;
    // setModel(value: any, label: string | undefined): void;
    emitChange(value: any, action: boolean);
}

// export interface MDropDownItemInterface extends Vue {
//     // propValue: any;
//     visible: boolean;
//     disabled: boolean;
//     hasFocus: boolean;
// }

export abstract class BaseDropdown extends ModulVue {
}

export abstract class BaseDropdownGroup extends Vue {
}

@WithRender
@Component
export class MDropdownItem extends ModulVue /*implements MDropDownItemInterface*/ {
    @Prop()
    public label: string;
    @Prop()
    public value: any;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public noDataDefaultItem: boolean;

    public componentName: string = DROPDOWN_ITEM_NAME;

    public inactif: boolean = false; // Without label and value
    public filter: string = ''; // Set by parent
    public root: MDropdownInterface; // Dropdown component
    public group: Vue | undefined; // Dropdown-group parent if there is one
    public hasFocus: boolean = false;

    public created(): void {
        let rootNode: BaseDropdown | undefined = this.getParent<BaseDropdown>(p => p instanceof BaseDropdown);

        if (rootNode) {
            this.root = (rootNode as any) as MDropdownInterface;
        } else {
            console.error('m-dropdown-item need to be inside m-dropdown');
        }

        this.group = this.getParent<BaseDropdownGroup>(p => p instanceof BaseDropdownGroup);

        // this.getMDropdownGroup(this);

        // if (!this.value && !this.label) {
        //     this.inactif = true;
        // }

        // (this.root as MDropdownInterface).$on('valueChanged',
        //     (value: any) => { this.updateTextfield(value); });

        // (this.root as MDropdownInterface).$on('filter',
        //     (value: string) => { this.filter = value; });

        // (this.root as MDropdownInterface).$on('keyPressEnter',
        //     (value: any) => {
        //         if (value === this.propValue) {
        //             this.onClick();
        //         }
        //     });

        // // If element is active add to array of items and increment counters
        // // Done a first time in the create because watch is not call on load
        // if (!this.inactif) {
        //     (this.root as MDropdownInterface).items.push(this);
        //     this.incrementCounters();
        // }

        // this.updateTextfield((this.root as MDropdownInterface).model);
    }

    // @Watch('visible')
    // public visibleChanged(visible: boolean): void {
    //     // if (!this.inactif) {
    //     //     if (visible) {
    //     //         this.incrementCounters();
    //     //     } else {
    //     //         this.decrementCounters();
    //     //     }
    //     // }
    // }

    // Value and label rules
    // - If Value and Label : Value = value, Label = label
    // - If only value : value = value, label = value.toString
    // - If only label : value = label, label = label
    // - If none: value = undef, label = undef and item is flag inactive
    public get propLabel(): string | undefined {
        if (this.label) {
            return this.label;
        } else {
            if (this.value) {
                if (typeof this.value == 'string') {
                    return this.value;
                } else {
                    return JSON.stringify(this.value);
                }
            } else {
                return undefined;
            }
        }
    }

    // public get propValue(): any {
    //     if (this.value) {
    //         return this.value;
    //     } else {
    //         if (this.label) {
    //             return this.label;
    //         } else {
    //             return undefined;
    //         }
    //     }
    // }

    // public get text(): string {
    //     return this.$el.innerText;
    // }

    public get selected(): boolean {
        // return !this.inactif && (this.root as MDropdownInterface).model == this.propValue;
        return (this.root as MDropdownInterface).model == this.value;
    }

    public get visible(): boolean {
        let isVisible: boolean = this.root.filter(this.propLabel);// || this.root.isFiltering() && !!(this.propLabel && !normalizeString(this.propLabel).match(this.root.filter));

        // if ((this.propLabel && !normalizeString(this.propLabel).match(this.root.filter)) ||
        //     (this.inactif && !this.hasItemsVisible())) {
        //     isVisible = false;
        // }

        // if (this.noDataDefaultItem && !this.hasItemsVisible()) {
        //     isVisible = true;
        // }

        return isVisible;
    }

    // public hasItemsVisible(): boolean {
    //     return (this.root && (this.root as MDropdownInterface).nbItemsVisible != 0);
    // }

    public onClick(): void {
        console.log(!this.noDataDefaultItem, !this.root.inactive, !this.disabled, !this.inactif);
        if (!this.noDataDefaultItem && !this.root.inactive && !this.disabled && !this.inactif) {
            console.log('set root.model', this.value);
            this.root.model = this.value;
            // (this.root as MDropdownInterface).emitChange(this.propValue, true);
        }
        (this.root as MDropdownInterface).toggleDropdown(false);
    }

    protected mounted() {
        // console.log('mounted');
        // let index: number = (this.root as MDropdownInterface).items.indexOf(this);

        // if (index > -1) {
        //     if ((this.root as MDropdownInterface).items[index] &&
        //         ((this.root as MDropdownInterface).items[index] as MDropdownItem).visible) {
        //         this.decrementCounters();
        //     }
        //     (this.root as MDropdownInterface).items.splice(index, 1);
        // }
    }

    protected beforeDestroy() {
        console.log('destroy');
        // let index: number = (this.root as MDropdownInterface).items.indexOf(this);

        // if (index > -1) {
        //     if ((this.root as MDropdownInterface).items[index] &&
        //         ((this.root as MDropdownInterface).items[index] as MDropdownItem).visible) {
        //         this.decrementCounters();
        //     }
        //     (this.root as MDropdownInterface).items.splice(index, 1);
        // }
    }

    private updateTextfield(value): void {
        // if (value === this.propValue) {
        //     (this.root as MDropdownInterface).setModel(this.propValue, this.propLabel);
        // }
    }

    // private incrementCounters(): void {
    //     (this.root as MDropdownInterface).nbItemsVisible++;
    //     if (this.group) {
    //         (this.group as MDropdownGroupInterface).nbItemsVisible++;
    //     }
    // }

    // private decrementCounters(): void {
    //     (this.root as MDropdownInterface).nbItemsVisible--;
    //     if (this.group) {
    //         (this.group as MDropdownGroupInterface).nbItemsVisible--;
    //     }
    // }

    // private getMDropdownGroup(node: Vue): void {

    // }

    private setHover(flag: boolean): void {
        if (flag) {
            (this.root as MDropdownInterface).setFocus(this);
        } else {
            this.hasFocus = false;
        }
    }
}

const DropdownItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_ITEM_NAME, MDropdownItem);
    }
};

export default DropdownItemPlugin;
