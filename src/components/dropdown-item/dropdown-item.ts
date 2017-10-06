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

    filter(text: string | undefined): boolean;
    setFocus(item: Vue): void;
    toggleDropdown(open: boolean): void;
    emitChange(value: any, action: boolean);

    // setModel(value: any, label: string | undefined): void;
    // nbItemsVisible: number;
    // export interface MDropDownItemInterface extends Vue {
    //     visible: boolean;
    //     disabled: boolean;
    //     focus: boolean;
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
    public root: MDropdownInterface; // Dropdown component
    public focus: boolean = false;
    // public filter: string = ''; // Set by parent
    public group: Vue | undefined; // Dropdown-group parent if there is one

    public created(): void {
        let rootNode: BaseDropdown | undefined = this.getParent<BaseDropdown>(p => p instanceof BaseDropdown);

        if (rootNode) {
            this.root = (rootNode as any) as MDropdownInterface;
        } else {
            console.error('m-dropdown-item need to be inside m-dropdown');
        }

        this.group = this.getParent<BaseDropdownGroup>(p => p instanceof BaseDropdownGroup);

        (this.root as MDropdownInterface).$on('keyPressEnter',
            (value: any) => {
                if (value === this) {
                    this.onClick();
                }
            });

        (this.root as MDropdownInterface).$on('focus',
            (value: Vue) => {
                if (this == value) {
                    this.focus = true;
                    this.$el.scrollIntoView();
                } else {
                    this.focus = false;
                }
            });

        //     // If element is active add to array of items and increment counters
        //     // Done a first time in the create because watch is not call on load
        //     if (!this.inactif) {
        //         (this.root as MDropdownInterface).items.push(this);
        //         this.incrementCounters();
        //     }

        //     this.updateTextfield((this.root as MDropdownInterface).model);
        // }

        // beforeDestroy() {
        //     let index: number = (this.root as MDropdownInterface).items.indexOf(this);
    }

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

    public get selected(): boolean {
        return (this.root as MDropdownInterface).model == this.value;
    }

    public get visible(): boolean {
        return this.root.filter(this.propLabel);
    }

    public onClick(): void {
        if (!this.noDataDefaultItem && !this.root.inactive && !this.disabled && !this.inactif) {
            this.root.model = this.value;
            (this.root as MDropdownInterface).toggleDropdown(false);
        }
    }
}

const DropdownItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_ITEM_NAME, MDropdownItem);
    }
};

export default DropdownItemPlugin;
