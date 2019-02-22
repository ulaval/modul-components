import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { MediaQueries } from '../../../mixins/media-queries/media-queries';
import { normalizeString } from '../../../utils/str/str';
import { ModulVue } from '../../../utils/vue/vue';
import WithRender from './dropdown-item.html?style=./dropdown-item.scss';

export interface MDropdownInterface {
    model: any;
    inactive: boolean;

    focused: any;
    matchFilter(text: string | undefined): boolean;
    groupHasItems(group: BaseDropdownGroup): boolean;
}

export abstract class BaseDropdown extends ModulVue {
}

export abstract class BaseDropdownGroup extends ModulVue {
}

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MDropdownItem extends ModulVue {
    @Prop()
    public label: string;
    @Prop()
    public value: any;
    @Prop()
    public disabled: boolean;
    @Prop()
    public readonly: boolean;
    @Prop()
    public nonFilterable: boolean;

    public root: MDropdownInterface; // Dropdown component
    public group: BaseDropdown | undefined; // Dropdown-group parent if there is one

    protected created(): void {
        let rootNode: BaseDropdown | undefined = this.getParent<BaseDropdown>(p => p instanceof BaseDropdown);

        if (rootNode) {
            this.root = (rootNode as any) as MDropdownInterface;
        } else {
            console.error('m-dropdown-item need to be inside m-dropdown');
        }

        this.group = this.getParent<BaseDropdownGroup>(p => p instanceof BaseDropdownGroup);
    }

    public get filtered(): boolean {
        if (this.propLabel && !this.nonFilterable) {
            return !this.root.matchFilter(normalizeString(this.propLabel));
        } else {
            return false;
        }
    }

    public get inactive(): boolean {
        return this.value === undefined;
    }

    // Value and label rules
    // - If Value and Label : Value = value, Label = label
    // - If only value : value = value, label = value.toString
    // - If only label : value = label, label = label
    // - If none: value = undef, label = undef and item is flag inactive
    public get propLabel(): string | undefined {
        if (this.label) {
            return this.label;
        } else if (this.value) {
            if (typeof this.value === 'string') {
                return this.value;
            } else {
                return JSON.stringify(this.value);
            }
        } else {
            return undefined;
        }
    }

    private get selected(): boolean {
        return this.root.model === this.value && !this.readonly;
    }

    private get focused(): boolean {
        return this.root.focused === this.value && !this.readonly;
    }

    private get tabindex(): number | undefined {
        return this.disabled || this.readonly ? undefined : 0;
    }

    private onClick(): void {
        if (!this.inactive && !this.root.inactive && !this.disabled) {
            this.root.model = this.value;
        }
    }
}
