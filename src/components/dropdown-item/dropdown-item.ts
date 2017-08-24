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
    public k: string;
    @Prop()
    public label: string;
    @Prop()
    public value: any;
    @Prop({ default: false })
    public selected: boolean;
    @Prop({ default: false })
    public disabled: boolean;

    public propSelected: boolean = this.selected;
    public propLabel: string = this.label;
    public propKey: string = this.k;

    public filter: string = '';
    public forceHide: boolean = false;
    public hasError: boolean = false;
    public root: Vue;
    public group: Vue | undefined;

    public created() {
        if (!this.value) {
            console.error(`[label: ${this.label}] La valeur (value) est obligatoire`);
            this.forceHide = true;
            this.hasError = true;
        } else {
            if (!this.label) {
                this.propLabel = this.value.toString();
            }

            if (!this.k) {
                if (typeof this.value == 'string') {
                    this.propKey = this.value;
                } else {
                    console.error(`[value: ${this.value}, label: ${this.label}] Une clef (k) est nécessaire quand la valeur (value) est un objet`);
                    this.forceHide = true;
                    this.hasError = true;
                }
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
    public visibleChanged(value): void {
        if (value) {
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

    // public get propLabel(): string {
    //     if (!this.label) {
    //         return this.value.toString();
    //     } else {
    //         return this.label;
    //     }
    // }

    // public get propKey(): string {
    //     let key: string #= this.k;

    //     if (!this.k) {
    //         if (typeof this.value == 'string') {
    //             key = this.value;
    //         } else {
    //             console.log('Une clef (k) est nécessaire quand la valeur (value) est un objet');
    //             key = 'undefined';
    //         }
    //     }

    //     return key;
    // }

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
                        if (array[i].key == this.propKey) {
                            array.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    this.propSelected = (this.root as MDropdownInterface).addAction = true;
                    array.push({ key: this.propKey, value: this.value, label: this.propLabel });
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
                array.push({ key: this.propKey, value: this.value, label: this.propLabel });
            }

            (this.root as MDropdownInterface).currentElement = {'key': this.propKey, 'value': this.value, label: this.propLabel};
        }
    }

    public getElement(): SelectedValue {
        return {'key': this.propKey, 'value': this.value, label: this.propLabel};
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
