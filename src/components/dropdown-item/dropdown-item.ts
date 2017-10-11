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
    inactive: boolean;

    focused: any;
    filter(text: string | undefined): boolean;
}

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
    public group: Vue | undefined; // Dropdown-group parent if there is one

    protected created(): void {
        let rootNode: BaseDropdown | undefined = this.getParent<BaseDropdown>(p => p instanceof BaseDropdown);

        if (rootNode) {
            this.root = (rootNode as any) as MDropdownInterface;
        } else {
            console.error('m-dropdown-item need to be inside m-dropdown');
        }

        this.group = this.getParent<BaseDropdownGroup>(p => p instanceof BaseDropdownGroup);
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

    public get visible(): boolean {
        return this.noDataDefaultItem || this.root.filter(this.normalizedLabel);
    }

    private get selected(): boolean {
        return (this.root as MDropdownInterface).model == this.value;
    }

    private get focused(): boolean {
        return (this.root as MDropdownInterface).focused == this.value;
    }

    private onMousedown(): void {
        if (!this.noDataDefaultItem && !this.root.inactive && !this.disabled && !this.inactif) {
            this.root.model = this.value;
        }
    }

    private get normalizedLabel(): string {
        if (this.propLabel) {
            return normalizeString(this.propLabel);
        } else {
            return '';
        }
    }
}

const DropdownItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_ITEM_NAME, MDropdownItem);
    }
};

export default DropdownItemPlugin;
