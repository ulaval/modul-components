import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';
import { normalizeString } from '../../utils/str/str';
import { KeyCode } from '../../utils/keycode/keycode';
import { MDropdownInterface, MDropdownItem, /*MDropDownItemInterface,*/ BaseDropdown } from '../dropdown-item/dropdown-item';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import i18nPlugin from '../../utils/i18n/i18n';
import DropdownItemPlugin from '../dropdown-item/dropdown-item';
import ButtonPlugin from '../button/button';
import TextFieldPlugin from '../text-field/text-field';
import ValidationMessagePlugin from '../validation-message/validation-message';
import PopupPlugin from '../popup/popup';

const PAGE_STEP: number = 3;
const DROPDOWN_MAX_HEIGHT: number = 220;
const DROPDOWN_MAX_WIDTH: string = '704px'; // 768 - (32*2)
const DROPDOWN_STYLE_TRANSITION: string = 'max-height 0.3s ease';

// export interface MDropdownInterface extends Vue {
//     model: any;
//     items: Vue[];
//     inactive: boolean;
//     // nbItemsVisible: number;
//     setFocus(item: Vue): void;
//     toggleDropdown(open: boolean): void;
//     setModel(value: any, label: string | undefined): void;
//     emitChange(value: any, action: boolean);
// }

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
    @Prop({ default: DROPDOWN_MAX_WIDTH })
    public width: string;
    @Prop()
    public textNoData: string;
    @Prop()
    public textNoMatch: string;

    public items: Vue[] = [];
    public itemsFocusable: Vue[] = [];
    // public nbItemsVisible: number = 0;

    private internalFilter: string = '';

    private internalValue: string | undefined = undefined;
    private internalItems: MDropdownItem[] = [];
    private internalSelectedText: string | undefined = '';
    private observer: any;

    // private selectedText: string = '';
    // private hasModel: boolean = true;
    private internalOpen: boolean = false;
    // private noItemsLabel: string;
    private dirty: boolean = false;

    private textFieldLabelEl: HTMLElement;
    private textFieldInputValueEl: HTMLElement;

    private componentName: string = DROPDOWN_NAME;

    public filter(text: string | undefined): boolean {
        if (text === undefined) {
            return true;
        } else if (!this.dirty) {
            return true;
        } else {
            let parsedQuery = String(this.internalFilter).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
            return new RegExp(parsedQuery, 'i').test(text);
        }
    }

    public setFocus(elementFocus: Vue): void {
        // for (let item of this.items) {
        //     if (item === elementFocus) {
        //         (item as MDropDownItemInterface).hasFocus = true;
        //     } else {
        //         (item as MDropDownItemInterface).hasFocus = false;
        //     }
        // }
    }

    public getFocus(): MDropdownItem | undefined {
        let elementFocus: MDropdownItem | undefined = undefined;

        // for (let item of this.items) {
        //     if ((item as MDropDownItemInterface).hasFocus) {
        //         elementFocus = (item as MDropDownItemInterface);
        //         break;
        //     }
        // }

        return elementFocus;
    }

    public emitChange(value: any, selected: boolean) {
        // this.$emit('change', value, selected);
    }

    public toggleDropdown(open: boolean): void {
        this.open = open;
    }

    protected mounted(): void {
        // console.log('m', this.$children);
        // console.log('m', this.$refs);
        // console.log('m', (this.$refs.mDropdownElements as Vue).$children);

        this.$nextTick(() => {
            this.buildItemsMap();

            this.observer = new MutationObserver(function(mutations) {
                console.log('slot mutation');
                this.buildItemsMap();
            }.bind(this));

            let o: any = document.body.getElementsByClassName('m-dropdown__list');// this.$el.querySelector('.m-popup');
            // console.log(o);
            if (o) {
                this.observer.observe(o[0], { childList: true }
                );
            }
        });
    }

    public get open(): boolean {
        return this.internalOpen;
    }

    public set open(open: boolean) {
        this.internalOpen = open;
        this.dirty = false;
        this.$nextTick(() => {
            if (open) {
                this.$emit('open');
            } else {
                this.$emit('close');
            }
        });
    }

    public get model(): any {
        return this.value == undefined ? this.internalValue : this.value;
    }

    public set model(value) {
        this.internalValue = value;
        this.$emit('input', value);
        // console.log('dirty false', this.dirty);
        this.dirty = false;
    }

    private get selectedText(): string {
        let result: string | undefined = '';
        if (this.dirty) {
            result = this.internalFilter;
        } else if (this.internalItems.every(item => {
            if (item.value == this.model) {
                result = item.propLabel;
                return false;
            }
            return true;
        })) {
            result = '';
        }
        return result;
    }

    private set selectedText(value: string) {
        this.dirty = true;
        this.internalFilter = value;
    }

    private buildItemsMap(): void {
        this.internalItems = (this.$refs.popper as Vue).$children[0].$children.filter(v => v instanceof MDropdownItem && !v.noDataDefaultItem && v.visible).map(v => v as MDropdownItem);
        // this.internalItems.forEach(i => console.log(i.label));
        // this.$nextTick(() => {
        //     this.internalItems.forEach(i => console.log(i.label));
        // });
    }

    private get propTextNoData(): string {
        return (this.textNoData ? this.textNoData : this.$i18n.translate('m-dropdown:no-data'));
    }

    private get propTextNoMatch(): string {
        return (this.textNoMatch ? this.textNoMatch : this.$i18n.translate('m-dropdown:no-result'));
    }

    private get hasItems(): boolean {
        return this.internalItems.length > 0;
    }

    private get noItemsLabel(): string {
        return (!this.internalItems || this.internalItems.length == 0) ? this.propTextNoData : this.propTextNoMatch;
    }

    public get inactive(): boolean {
        return this.disabled || this.waiting;
    }

    private filterDropdown(text: string): void {
        // this.dirty = true;
        // console.log('dirty');
        // // this.$emit('filter', normalizeString(text.trim()));
    }

    // private onBlur(event): void {
    //     // if (this.editable && this.dirty) {
    //     //     setTimeout(() => {
    //     //         if (!this.model || this.model == '') {
    //     //             // this.selectedText = '';
    //     //             this.$emit('valueChanged');
    //     //         } else {
    //     //             this.$emit('valueChanged', this.model);
    //     //         }
    //     //     }, 100);
    //     // }
    //     // console.log('blur');
    //     // this.dirty = false;
    // }

    private onFocus(event: Event): void {
        if (this.editable) {
            // this.dirty = true;
            // this.selectedText = '';
        }
    }

    private onBlur(event): void {

    //     if (this.internalOpen) {
    //         this.toggleDropdown(false);
    //     }

    //     setTimeout(() => { // Wait that the dropdown is closed before clearing
    //         this.$emit('filter'); // Clear filter
    //         this.$emit('focus'); // Clear focus
    //     }, 300);
    }

    private clearField(): void {
        this.$emit('input');
    }

    private onKeyup($event: KeyboardEvent): void {
        // this.itemsFocusable = (this.items as MDropDownItemInterface[]).filter(item => (item.disabled === false && item.visible === true));

        // switch ($event.keyCode) {
        //     case KeyCode.M_ENTER:
        //     case KeyCode.M_RETURN:
        //         let currentFocus: Vue | undefined = this.getFocusItem();
        //         if (currentFocus) {
        //             this.$emit('keyPressEnter', currentFocus);
        //         }
        //         return;
        //     case KeyCode.M_SPACE:
        //         if (!this.internalOpen) {
        //             this.internalOpen = true;
        //         }
        //         break;
        //     case KeyCode.M_ESCAPE:
        //         this.internalOpen = false;
        //         return;
        //     case KeyCode.M_UP:
        //         if (this.internalOpen) {
        //             this.getPreviousFocusItem(this.getFocusItem());
        //         }
        //         break;
        //     case KeyCode.M_DOWN:
        //         if (!this.internalOpen) {
        //             this.internalOpen = true;
        //         } else {
        //             this.getNextFocusItem(this.getFocusItem());
        //         }
        //         break;
        //     case KeyCode.M_PAGE_UP:
        //         if (this.internalOpen) {
        //             this.getPreviousFocusItem(this.getFocusItem(), PAGE_STEP);
        //         }
        //         break;
        //     case KeyCode.M_PAGE_DOWN:
        //         if (!this.internalOpen) {
        //             this.internalOpen = true;
        //         } else {
        //             this.getNextFocusItem(this.getFocusItem(), PAGE_STEP);
        //         }
        //         break;
        //     case KeyCode.M_HOME:
        //         if (this.internalOpen) {
        //             this.getFirstFocusItem();
        //         }
        //         break;
        //     case KeyCode.M_END:
        //         if (!this.internalOpen) {
        //             this.internalOpen = true;
        //         } else {
        //             this.getLastFocusItem();
        //         }
        //         break;
        // }
    }

    private getFocusItem(): Vue | undefined {
        let elementFocused: Vue | undefined = undefined;

        // for (let item of this.items) {
        //     if ((item as MDropDownItemInterface).focus) {
        //         elementFocused = item;
        //     }
        // }

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

        // public setModel(value: any, label: string | undefined): void {
    //     // if (label) {
    //     //     this.selectedText = label;
    //     // }

    //     // this.$emit('input', value);
    //     // setTimeout(() => {
    //     //     this.$emit('filter'); // Clear filter
    //     // }, 300);
    // }

    // protected updated(): void {
    //     // console.log('u', this.$children);
    //     // console.log('u', this.$refs);
    //     // console.log('u', (this.$refs.mDropdownElements as Vue).$children);
    //     // this.buildItemsMap();
    // }

    // @Watch('value')
    // private valueChanged(value: any): void {
    //     this.selectedText = '';
    //     this.$emit('valueChanged', value);
    // }
}

const DropdownPlugin: PluginObject<any> = {
    install(v, options) {
        Vue.use(DropdownItemPlugin);
        Vue.use(TextFieldPlugin);
        Vue.use(ButtonPlugin);
        Vue.use(PopupPlugin);
        Vue.use(ValidationMessagePlugin);
        Vue.use(MediaQueriesPlugin);
        Vue.use(i18nPlugin);
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default DropdownPlugin;
