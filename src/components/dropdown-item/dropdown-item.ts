import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown-item.html?style=./dropdown-item.scss';
import { DROPDOWN_ITEM_NAME } from '../component-names';
import { normalizeString } from '../../utils/str/str';
import { KeyCode } from '../../utils/keycode/keycode';
import { MDropdownInterface, SelectedValue } from '../dropdown/dropdown';
import { MDropdownGroupInterface } from '../dropdown-group/dropdown-group';

export interface MDropDownItemInterface extends Vue {
    filter: string;
    visible: boolean;
    disabled: boolean;
    inactif: boolean;
    propSelected: boolean;
    hasFocus: boolean;
    onSelectElement(): void;
}

export abstract class BaseDropdown extends ModulVue {
}

export abstract class BaseDropdownGroup extends Vue {
}

@WithRender
@Component
export class MDropdownItem extends ModulVue implements MDropDownItemInterface {
    @Prop()
    public label: string;
    @Prop()
    public value: any;
    @Prop({ default: false })
    public selected: boolean;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public noDataDefaultItem: boolean;

    public componentName: string = DROPDOWN_ITEM_NAME;

    public key: string; // Dynamically create
    public inactif: boolean = false; // Without label and value
    public filter: string = ''; // Set by parent
    public hasError: boolean = false;
    public root: Vue; // Dropdown component
    public group: Vue | undefined; // Dropdown-group parent if there is one
    public hasFocus: boolean = false;

    private internalSelected: boolean = false;

    public created(): void {
        this.propSelected = this.selected;
        this.key = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();

        this.getMDropdownRoot(this);
        this.getMDropdownGroup(this);

        if (!this.value && !this.label) {
            this.inactif = true;
        }

        // If element is not inactif add to array of items and increment counters
        if (!this.inactif) {
            (this.root as MDropdownInterface).items.push(this);
            (this.root as MDropdownInterface).nbItemsVisible++;

            if (this.group) {
                (this.group as MDropdownGroupInterface).nbItemsVisible++;
            }
        }

        // Check if element is in v-model
        if ((this.root as MDropdownInterface).multiple) {
            if (Array.isArray((this.root as MDropdownInterface).value)) {
                if ((this.root as MDropdownInterface).value.indexOf(this.propValue) != -1) {
                    this.propSelected = true;
                }
            } else {
                console.error('Model must be an Array');
            }
        } else {
            if (Array.isArray((this.root as MDropdownInterface).value)) {
                console.error('Model can\'t be an Array');
            } else {
                if ((this.root as MDropdownInterface).defaultFirstElement &&
                    !(this.root as MDropdownInterface).isDisabled &&
                    !this.disabled &&
                    !this.inactif &&
                    !(this.root as MDropdownInterface).value &&
                    (this.root as MDropdownInterface).selected.length == 0) {

                    // If no v-model and flag defaultFirstElement set first element as selected
                    this.propSelected = true;

                } else if ((this.root as MDropdownInterface).value && (this.root as MDropdownInterface).value === this.propValue) {
                    // If v-model and current element in model
                    this.propSelected = true;
                }
            }
        }

        // When an element is selected (prop flag), we add it to dropdown container of selected element
        // On multiple mode, we add it
        // On single mode, we add the first selected that we get
        if (!this.inactif && this.propSelected) {
            if ((this.root as MDropdownInterface).multiple || (this.root as MDropdownInterface).selected.length == 0) {
                (this.root as MDropdownInterface).selected.push({ key: this.key, value: this.propValue, label: this.propLabel });
                (this.root as MDropdownInterface).currentElement = {key: this.key, value: this.propValue, label: this.propLabel};
            }
        }
    }

    beforeDestroy() {
        let index: number = (this.root as MDropdownInterface).items.indexOf(this);

        if (index > -1) {
            if ((this.root as MDropdownInterface).items[index] && ((this.root as MDropdownInterface).items[index] as MDropdownItem).visible) {
                (this.root as MDropdownInterface).nbItemsVisible--;
            }
            (this.root as MDropdownInterface).items.splice(index, 1);
        }

        for (let i = 0; i < (this.root as MDropdownInterface).selected.length; i++) {
            if ((this.root as MDropdownInterface).selected[i].key == this.key) {
                (this.root as MDropdownInterface).selected.splice(i, 1);
                break;
            }
        }

        if (this.group) {
            (this.group as MDropdownGroupInterface).nbItemsVisible--;
        }
    }

    @Watch('visible')
    public visibleChanged(visible: boolean): void {
        if (!this.inactif) {
            if (visible) {
                (this.root as MDropdownInterface).nbItemsVisible++;
                if (this.group) {
                    (this.group as MDropdownGroupInterface).nbItemsVisible++;
                }
            } else {
                (this.root as MDropdownInterface).nbItemsVisible--;
                if (this.group) {
                    (this.group as MDropdownGroupInterface).nbItemsVisible--;
                }
            }
        }
    }

    @Watch('selected')
    public selectedChanged(selected: boolean): void {
        this.onSelectElement();
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
                    return this.propValue;
                } else {
                    return JSON.stringify(this.propValue);
                }
            } else {
                return undefined;
            }
        }
    }

    public get propValue(): any {
        if (this.value) {
            return this.value;
        } else {
            if (this.label) {
                return this.label;
            } else {
                return undefined;
            }
        }
    }

    public get propSelected(): boolean {
        return this.internalSelected;
    }

    public set propSelected(selected: boolean) {
        this.internalSelected = selected != undefined ? selected : false;
    }

    public get visible(): boolean {
        let isVisible: boolean = true;

        if ((this.propLabel && !normalizeString(this.propLabel).match(this.filter)) ||
            (this.inactif && (this.root && (this.root as MDropdownInterface).nbItemsVisible == 0))) {
            isVisible = false;
        }

        if (this.noDataDefaultItem && (this.root && (this.root as MDropdownInterface).nbItemsVisible == 0)) {
            isVisible = true;
        }

        return isVisible;
    }

    public onSelectElement(): void {
        if (!this.disabled && !this.inactif) {
            let array: Array<SelectedValue> = (this.root as MDropdownInterface).selected;

            if ((this.root as MDropdownInterface).multiple) {
                // Dropdown with multiple selection: Add current selection to previous
                if (this.propSelected) {
                    this.propSelected = (this.root as MDropdownInterface).addAction = false;
                    for (let i = 0; i < array.length; i++) {
                        if (array[i].key == this.key) {
                            array.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    this.propSelected = (this.root as MDropdownInterface).addAction = true;
                    array.push({ key: this.key, value: this.propValue, label: this.propLabel });
                }
            } else {
                // Dropdown without multiple selection: FirstRemove past selection, then add new
                let currentSelectedElement: SelectedValue = array[0];
                if (currentSelectedElement) {
                    for (let item of (this.root as MDropdownInterface).items) {
                        (item as MDropDownItemInterface).propSelected = false;
                    }
                    array.splice(0, 1);
                }

                this.propSelected = (this.root as MDropdownInterface).addAction = true;
                array.push({ key: this.key, value: this.propValue, label: this.propLabel });

                (this.root as MDropdownInterface).toggleDropdown(false);
            }

            (this.root as MDropdownInterface).currentElement = {key: this.key, value: this.propValue, label: this.propLabel};
        }
    }

    private getMDropdownRoot(node: Vue): void {
        let rootNode: BaseDropdown | undefined = this.getParent<BaseDropdown>(p => p instanceof BaseDropdown);

        if (rootNode) {
            this.root = rootNode;
        } else {
            console.error('m-dropdown-item need to be inside m-dropdown');
        }
    }

    private getMDropdownGroup(node: Vue): void {
        let groupNode: BaseDropdownGroup | undefined = this.getParent<BaseDropdownGroup>(p => p instanceof BaseDropdownGroup);

        this.group = groupNode;
    }

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
