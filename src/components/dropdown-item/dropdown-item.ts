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
    propInactif: boolean;
    propSelected: boolean;
    hasFocus: boolean;
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
    @Prop({ default: false })
    public inactif: boolean;

    public componentName: string = DROPDOWN_ITEM_NAME;
    public propLabel: string = this.label;
    public propValue: string = this.value;
    public propInactif: boolean = this.inactif;

    public key: string;
    public filter: string = '';
    public forceHide: boolean = false;
    public hasError: boolean = false;
    public root: Vue;
    public group: Vue | undefined;
    public hasFocus: boolean = false;

    private internalSelected: boolean = false;

    public created(): void {
        this.propSelected = this.selected;
        this.key = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
        this.root = this.getMDropdownRoot(this.$parent);
        this.group = this.getMDropdownGroup(this.$parent);

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
                console.debug(`Inactif`);
                this.propInactif = true;
            } else {
                this.propLabel = this.label;
                this.propValue = this.propLabel;
            }
        }

        if (!this.propInactif) {
            (this.root as MDropdownInterface).items.push(this);
            (this.root as MDropdownInterface).nbItemsVisible++;

            if (this.group) {
                (this.group as MDropdownGroupInterface).nbItemsVisible++;
            }
        }

        if (!this.propInactif && this.propSelected) {
            if ((this.root as MDropdownInterface).multiple || (this.root as MDropdownInterface).selected.length == 0) {
                (this.root as MDropdownInterface).selected.push({ key: this.key, value: this.propValue, label: this.propLabel });
                (this.root as MDropdownInterface).currentElement = {key: this.key, value: this.propValue, label: this.propLabel};
            }
        }
    }

    beforeDestroy() {
        (this.root as MDropdownInterface).itemDestroy(this);
        if (this.group) {
            (this.group as MDropdownGroupInterface).nbItemsVisible--;
        }
    }

    @Watch('visible')
    public visibleChanged(visible: boolean): void {
        if (!this.propInactif) {
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

    public get visible(): boolean {
        let isVisible: boolean = false;

        if (!this.forceHide && (this.filter == '' || this.filter == normalizeString(this.propLabel) || normalizeString(this.propLabel).match(this.filter))) {
            isVisible = true;
        }

        return isVisible;
    }

    public get propSelected(): boolean {
        return this.internalSelected;
    }

    public set propSelected(selected: boolean) {
        this.internalSelected = selected != undefined ? selected : false;
    }

    public onSelectElement(): void {
        if (!(this.disabled || this.propInactif)) {
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

    private getMDropdownRoot(node: Vue): Vue {
        if (node.$options.name != 'MDropdown') {
            node = this.getMDropdownRoot(node.$parent);
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
