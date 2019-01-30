import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ModulVue } from '../../../utils/vue/vue';
import { BaseOption, MOptionInterface } from '../option';
import WithRender from './option-item.html?style=./option-item.scss';


@WithRender
@Component
export class MOptionItem extends ModulVue {

    @Prop()
    public iconName: string;
    @Prop()
    public disabled: boolean;

    public root: MOptionInterface; // Menu component
    private hasRoot: boolean = false;

    protected mounted(): void {
        let rootNode: BaseOption | undefined = this.getParent<BaseOption>(p => p instanceof BaseOption);

        if (rootNode) {
            this.root = (rootNode as any) as MOptionInterface;
            this.hasRoot = true;
        } else {
            console.error('m-option-item need to be inside m-option');
        }
    }

    private onClick(event: MouseEvent): void {
        if (!this.disabled) {
            if (this.hasRoot) {
                (this.root).close();
                this.$emit('click', event);
            }
        } else {
            event.stopPropagation();
        }
    }

    private get hasIconNameProp(): boolean {
        return !!this.iconName;
    }

    private get hasIcon(): boolean {
        if (this.hasRoot) {
            (this.root).checkIcon(this.hasIconNameProp);
            return (this.root).hasIcon;
        }
        return false;
    }

    private get hasDefaultSlot(): boolean {
        return !!this.$slots.default;
    }
}
