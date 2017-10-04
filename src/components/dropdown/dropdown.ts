import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';
import { normalizeString } from '../../utils/str/str';
import { KeyCode } from '../../utils/keycode/keycode';
import { MDropDownItemInterface, BaseDropdown } from '../dropdown-item/dropdown-item';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';

const PAGE_STEP: number = 3;
const DROPDOWN_MAX_HEIGHT: number = 220;
const DROPDOWN_MAX_WIDTH: string = '704px'; // 768 - (32*2)
const DROPDOWN_STYLE_TRANSITION: string = 'max-height 0.3s ease';

export interface MDropdownInterface extends Vue {
    model: any;
    items: Vue[];
    inactive: boolean;
    nbItemsVisible: number;
    toggleDropdown(open: boolean): void;
    setModel(value: any, label: string | undefined): void;
    emitChange(value: any, action: boolean);
}

@WithRender
@Component({
    mixins: [
        InputState,
        MediaQueries
    ]
})
export class MDropdown extends BaseDropdown implements MDropdownInterface {
    @Prop()
    public value: any;
    @Prop()
    public label: string;
    @Prop()
    public defaultText: string;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public waiting: boolean;
    @Prop({ default: false })
    public editable: boolean;
    // @Prop({ default: false })
    // public multiple: boolean;
    @Prop({default: DROPDOWN_MAX_WIDTH })
    public width: string;
    @Prop()
    public textNoData: string;
    @Prop()
    public textNoMatch: string;

    public items: Vue[] = [];
    public itemsFocusable: Vue[] = [];
    public nbItemsVisible: number = 0;

    private selectedText: string = '';
    private hasModel: boolean = true;
    private internalOpen: boolean = false;
    private noItemsLabel: string;

    private textFieldLabelEl: HTMLElement;
    private textFieldInputValueEl: HTMLElement;

    private componentName: string = DROPDOWN_NAME;

    public setModel(value: any, label: string | undefined): void {
        if (label) {
            this.selectedText = label;
        }

        this.$emit('input', value);
        setTimeout(() => {
            this.$emit('filter'); // Clear filter
        }, 300);
    }

    public emitChange(value: any, selected: boolean) {
        this.$emit('change', value, selected);
    }

    public toggleDropdown(open: boolean): void {
        this.$nextTick(() => {
            if (this.internalOpen != open) {
                this.internalOpen = open;
            }
        });
    }

    public get model(): any {
        this.hasModel = !!this.value;
        this.selectedText = '';
        this.$emit('valueChanged', this.value);

        return this.value;
    }

    public get open(): boolean {
        return this.internalOpen;
    }

    public set open(open: boolean) {
        this.internalOpen = open != undefined ? open : false;
        this.$nextTick(() => {
            if (open) {
                this.$emit('open');
            } else {
                this.$emit('close');
            }
        });
    }

    private get propEditable(): boolean {
        return this.editable;
    }

    private get propTextNoData(): string {
        return (this.textNoData ? this.textNoData : this.$i18n.translate('m-dropdown:no-data'));
    }

    private get propTextNoMatch(): string {
        return (this.textNoMatch ? this.textNoMatch : this.$i18n.translate('m-dropdown:no-result'));
    }

    private get noItems(): boolean {
        let show: boolean = false;

        if (this.nbItemsVisible == 0) {
            this.noItemsLabel = this.items.length == 0 ? this.propTextNoData : this.propTextNoMatch;
            show = true;
        }

        return show;
    }

    public get inactive(): boolean {
        return this.disabled || this.waiting;
    }

    private filterDropdown(text: string): void {
        if (!this.internalOpen) {
            this.toggleDropdown(true);
        }
        this.$emit('filter', normalizeString(text.trim()));
    }

    private onFocus(event: Event): void {
        if (this.propEditable) {
            this.selectedText = '';
        }
    }

    private onBlur(event): void {
        if (this.propEditable) {
            this.selectedText = '';
            this.$emit('valueChanged', this.model);
        }

        if (this.internalOpen) {
            this.toggleDropdown(false);
        }

        setTimeout(() => { // Wait that the dropdown is closed before clearing
            this.$emit('filter'); // Clear filter
            this.$emit('focus'); // Clear focus
        }, 300);
    }

    private clearField(): void {
        this.$emit('input');
    }

    private onKeyup($event: KeyboardEvent): void {
        this.itemsFocusable = (this.items as MDropDownItemInterface[]).filter(item => (item.disabled === false && item.visible === true));

        switch ($event.keyCode) {
            case KeyCode.M_ENTER:
            case KeyCode.M_RETURN:
                let currentFocus: Vue | undefined = this.getFocusItem();
                if (currentFocus) {
                    this.$emit('keyPressEnter', currentFocus);
                }
                return;
            case KeyCode.M_SPACE:
                if (!this.internalOpen) {
                    this.internalOpen = true;
                }
                break;
            case KeyCode.M_ESCAPE:
                this.internalOpen = false;
                return;
            case KeyCode.M_UP:
                if (this.internalOpen) {
                    this.getPreviousFocusItem(this.getFocusItem());
                }
                break;
            case KeyCode.M_DOWN:
                if (!this.internalOpen) {
                    this.internalOpen = true;
                } else {
                    this.getNextFocusItem(this.getFocusItem());
                }
                break;
            case KeyCode.M_PAGE_UP:
                if (this.internalOpen) {
                    this.getPreviousFocusItem(this.getFocusItem(), PAGE_STEP);
                }
                break;
            case KeyCode.M_PAGE_DOWN:
                if (!this.internalOpen) {
                    this.internalOpen = true;
                } else {
                    this.getNextFocusItem(this.getFocusItem(), PAGE_STEP);
                }
                break;
            case KeyCode.M_HOME:
                if (this.internalOpen) {
                    this.getFirstFocusItem();
                }
                break;
            case KeyCode.M_END:
                if (!this.internalOpen) {
                    this.internalOpen = true;
                } else {
                    this.getLastFocusItem();
                }
                break;
        }
    }

    private getFocusItem(): Vue | undefined {
        let elementFocused: Vue | undefined = undefined;

        for (let item of this.items) {
            if ((item as MDropDownItemInterface).focus) {
                elementFocused = item;
            }
        }

        return elementFocused;
    }

    private getNextFocusItem(currentItem: Vue | undefined, step: number = 1): void {
        let index: number;

        if (currentItem) {
            index = this.itemsFocusable.indexOf(currentItem);
            index = index + step < this.itemsFocusable.length ? index + step : this.itemsFocusable.length - 1;
        } else {
            index = 0;
        }

        this.$emit('focus', this.itemsFocusable[index]);
    }

    private getPreviousFocusItem(currentItem: Vue | undefined, step: number = 1): void {
        let index: number;

        if (currentItem) {
            index = this.itemsFocusable.indexOf(currentItem);
            index = index - step >= 0 ? index - step : 0;
        } else {
            index = this.itemsFocusable.length - 1;
        }

        this.$emit('focus', this.itemsFocusable[index]);
    }

    private getFirstFocusItem(): void {
        this.$emit('focus', this.itemsFocusable[0]);
    }

    private getLastFocusItem(): void {
        this.$emit('focus', this.itemsFocusable[this.itemsFocusable.length - 1]);
    }

    private transitionEnter(el: HTMLElement, done: any): void {
        this.$nextTick(() => {
            if (this.as<MediaQueriesMixin>().isMqMinS) {
                let height: number = el.clientHeight > DROPDOWN_MAX_HEIGHT ? DROPDOWN_MAX_HEIGHT : el.clientHeight;
                el.style.webkitTransition = DROPDOWN_STYLE_TRANSITION;
                el.style.transition = DROPDOWN_STYLE_TRANSITION;
                el.style.overflowY = 'hidden';
                el.style.maxHeight = '0';
                el.style.width = this.$el.clientWidth + 'px';
                setTimeout(() => {
                    el.style.maxHeight = height + 'px';
                    done();
                }, 0);
            } else {
                done();
            }
        });
    }

    private transitionAfterEnter(el: HTMLElement): void {
        if (this.as<MediaQueriesMixin>().isMqMinS) {
            setTimeout(() => {
                el.style.maxHeight = DROPDOWN_MAX_HEIGHT + 'px';
                el.style.overflowY = 'auto';
            }, 300);
        }
    }

    private transitionLeave(el: HTMLElement, done: any): void {
        this.$nextTick(() => {
            if (this.as<MediaQueriesMixin>().isMqMinS) {
                let height: number = el.clientHeight;
                el.style.width = this.$el.clientWidth + 'px';
                el.style.maxHeight = height + 'px';
                el.style.overflowY = 'hidden';
                el.style.maxHeight = '0';
                setTimeout(() => {
                    el.style.maxHeight = 'none';
                    done();
                }, 300);
            } else {
                done();
            }
        });
    }
}

const DropdownPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default DropdownPlugin;
