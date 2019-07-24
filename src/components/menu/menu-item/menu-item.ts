import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Location } from 'vue-router';
import uuid from '../../../utils/uuid/uuid';
import { ModulVue } from '../../../utils/vue/vue';
import { MAccordionTransition } from '../../transitions/accordion-transition/accordion-transition';
import { BaseMenu, Menu } from '../menu';
import WithRender from './menu-item.html?style=./menu-item.scss';

export abstract class BaseMenuItem extends ModulVue {
}

export interface MenuItem {
    group: boolean;
    propOpen: boolean;
    selected: boolean;
    groupSelected: boolean;
    insideGroup: boolean;
}

@WithRender
@Component
export class MMenuItem extends BaseMenuItem implements MenuItem {
    @Prop()
    public open: boolean;
    @Prop()
    public value: string;
    @Prop()
    public label: string;
    @Prop()
    public url: string | Location;
    @Prop()
    public iconName: string;
    @Prop()
    public disabled: boolean;

    $refs: {
        transition: MAccordionTransition;
    };

    public group: boolean = false;
    public selected: boolean = false;
    public groupSelected: boolean = false;
    public insideGroup = false;
    // tslint:disable-next-line:no-null-keyword
    public menuRoot: Menu | null = null;
    // tslint:disable-next-line:no-null-keyword
    public groupItemRoot: MenuItem | null = null;
    private internalOpen: boolean = false;

    private ariaControls: string = `mMenuItem-${uuid.generate()}-controls`;

    protected mounted(): void {
        let menuRoot: BaseMenu | undefined = this.getParent<BaseMenu>(p => p instanceof BaseMenu || p.$options.name === 'MMenu');
        if (menuRoot) {
            this.menuRoot = (menuRoot as any) as Menu;
        } else {
            console.error('<m-menu-item> need to be inside <m-menu>');
        }

        this.group = !!this.$refs.transition.$children.find(item => item instanceof MMenuItem);

        this.propOpen = this.open;
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    public set propOpen(open: boolean) {
        if (this.group) {
            this.internalOpen = open;
            this.$emit('update:open', open);
        }
    }

    public get propOpen(): boolean {
        return this.internalOpen;
    }

    public getGroupItem(): MMenuItem[] {
        return this.$refs.transition.$children
            .filter(child => child instanceof MMenuItem)
            .map(child => child as MMenuItem);
    }

    public get isAnimReady(): boolean {
        return this.menuRoot ? this.menuRoot.animReady : false;
    }

    private get isUrl(): boolean {
        return !!this.url && !this.group;
    }

    private toggleOpen(): void {
        this.propOpen = !this.propOpen;
    }

    public get isDisabled(): boolean {
        return this.menuRoot && this.menuRoot.propDisabled ? true : this.disabled;
    }

    private onClick(event: Event): void {
        if (!this.isDisabled && this.menuRoot && !this.menuRoot.closeOnSelectionInAction) {
            if (this.group) {
                this.toggleOpen();
            } else if (this.value !== this.menuRoot.model) {
                this.menuRoot.updateValue(this.value);
                this.menuRoot.onClick(event, this.value);
            }
            this.$emit('click', event);
        }
    }
}

