import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown-item.html?style=./dropdown-item.scss';
import { DROPDOWN_ITEM_NAME } from '../component-names';
import { normalizeString } from '../../utils/str/str';
import { MDropDownInterface, SelectedValue } from '../dropdown/dropdown';
import { MDropdownGroupInterface } from '../dropdown-group/dropdown-group';

export interface MDropDownItemInterface extends Vue {
    filter: string;
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

        this.group = this.getMDropdownGroup(this.$parent);
        if (this.group) {
            (this.group as MDropdownGroupInterface).nbItemVisible++;
        }

    }

    @Watch('visible')
    public visibleChanged(value): void {
        if (this.group) {
            if (value) {
                (this.group as MDropdownGroupInterface).nbItemVisible++;
            } else {
                (this.group as MDropdownGroupInterface).nbItemVisible--;
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
        let parent: Vue = this.getRootMDropdown(this.$parent);
        let array: Array<SelectedValue> = (parent as MDropDownInterface).selected;

        if (this.propSelected) {
            this.propSelected = (parent as MDropDownInterface).addAction = false;
            for (let i = 0; i < array.length; i++) {
                if (array[i].key == this.propKey) {
                    array.splice(i, 1);
                    break;
                }
            }
        } else {
            this.propSelected = (parent as MDropDownInterface).addAction = true;
            array.push({ key: this.propKey, value: this.value });
        }
        (parent as MDropDownInterface).currentElement = {'key': this.propKey, 'value': this.value};
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
