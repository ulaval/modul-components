import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown-item.html?style=./dropdown-item.scss';
import { DROPDOWN_ITEM_NAME } from '../component-names';
import { normalizeString } from '../../utils/str/str';
import { MDropdownInterface, SelectedValue } from '../dropdown/dropdown';
import { MDropdownGroupInterface } from '../dropdown-group/dropdown-group';

export interface MDropDownItemInterface extends Vue {
    filter: string;
    propSelected: boolean;
    onSelectElement(): void;
}

@WithRender
@Component
export class MDropdownItem extends Vue implements MDropDownItemInterface {
    @Prop()
    public label: string;
    @Prop()
    public value: any;
    @Prop({ default: false })
    public selected: boolean;
    @Prop({ default: false })
    public disabled: boolean;

    public componentName: string = DROPDOWN_ITEM_NAME;
    public propLabel: string = this.label;
    public propValue: string = this.value;

    public key: string;
    public filter: string = '';
    public forceHide: boolean = false;
    public hasError: boolean = false;
    public root: Vue;
    public group: Vue | undefined;

    private internalSelected: boolean = false;
    public created(): void {
        this.propSelected = this.selected;
        this.key = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();

        if (this.value) {
            this.propValue = this.value;

            if (!this.label) {
                if (typeof this.propValue == 'string') {
                    this.propLabel = this.propValue;
                } else {
                    this.propLabel = JSON.stringify(this.propValue);
                }
            }
        } else {
            if (!this.label) {
                console.error(`DROPDOWN-ITEM: La valeur (value) ou libellé (label) est obligatoire`);
                //  In V2.0 allow custom template using slot in this case
                this.forceHide = true;
                this.hasError = true;
            } else {
                this.propLabel = this.label;
                this.propValue = this.propLabel;
            }
        }

        this.root = this.getRootMDropdown(this.$parent);
        (this.root as MDropdownInterface).nbItems++;
        (this.root as MDropdownInterface).nbItemsVisible++;

        this.group = this.getMDropdownGroup(this.$parent);
        if (this.group) {
            (this.group as MDropdownGroupInterface).nbItemsVisible++;
        }

    }

    @Watch('visible')
    public visibleChanged(visible: boolean): void {
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

    @Watch('selected')
    public selectedChanged(selected: boolean): void {
        this.propSelected = selected;
    }

    public get visible(): boolean {
        let isVisible: boolean = false;

        if (!this.forceHide && (this.filter == '' || this.filter == normalizeString(this.propLabel) || normalizeString(this.propLabel).match(this.filter))) {
            isVisible = true;
        }

        return isVisible;
    }

    public onSelectElement(): void {
        if (!this.disabled) {
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
                // Dropdown without multiple selection: Remove first past selection before adding new
                let currentSelectedElement: SelectedValue = array[0];
                if (currentSelectedElement && currentSelectedElement.key) {
                    let item: Vue | undefined = (this.root as MDropdownInterface).getElement(currentSelectedElement.key);
                    if (item) {
                        (item as MDropDownItemInterface).propSelected = false;
                    }
                    array.splice(0, 1);
                }

                this.propSelected = (this.root as MDropdownInterface).addAction = true;
                array.push({ key: this.key, value: this.propValue, label: this.propLabel });
            }

            (this.root as MDropdownInterface).currentElement = {key: this.key, value: this.propValue, label: this.propLabel};
        }
    }

    public get propSelected(): boolean {
        return this.internalSelected;
    }

    public set propSelected(selected: boolean) {
        this.internalSelected = selected != undefined ? selected : false;
    }

    private getRootMDropdown(node: Vue): Vue {
        if (node.$options.name != 'MDropdown') {
            node = this.getRootMDropdown(node.$parent);
        }

        return node;
    }

    private getMDropdownGroup(node: Vue): Vue | undefined {
        let currentNode: Vue | undefined = node;

        if (node.$options.name == 'MDropdown') {
            currentNode = undefined;
        } else if (node.$options.name != 'MDropdownGroup') {
            currentNode = this.getMDropdownGroup(node.$parent);
        }

        return currentNode;
    }

}

const DropdownItemPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_ITEM_NAME, MDropdownItem);
    }
};

export default DropdownItemPlugin;
