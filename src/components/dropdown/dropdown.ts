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

    // public items: Vue[] = [];
    // public itemsFocusable: Vue[] = [];
    // public nbItemsVisible: number = 0;

    private internalFilter: string = '';

    private internalValue: any | undefined = undefined;
    private internalItems: MDropdownItem[] = [];
    private internalSelectedText: string | undefined = '';
    private observer: any;
    private focusedIndex: number = -1;

    // private selectedText: string = '';
    // private hasModel: boolean = true;
    private internalOpen: boolean = false;
    // private noItemsLabel: string;
    private dirty: boolean = false;
    private preventBlur: boolean = false;

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

    // public setFocus(elementFocus: Vue): void {
    //     // for (let item of this.items) {
    //     //     if (item === elementFocus) {
    //     //         (item as MDropDownItemInterface).hasFocus = true;
    //     //     } else {
    //     //         (item as MDropDownItemInterface).hasFocus = false;
    //     //     }
    //     // }
    // }

    // public getFocus(): MDropdownItem | undefined {
    //     let elementFocus: MDropdownItem | undefined = undefined;

    //     // for (let item of this.items) {
    //     //     if ((item as MDropDownItemInterface).hasFocus) {
    //     //         elementFocus = (item as MDropDownItemInterface);
    //     //         break;
    //     //     }
    //     // }

    //     return elementFocus;
    // }

    // public emitChange(value: any, selected: boolean) {
    //     // this.$emit('change', value, selected);
    // }

    // public toggleDropdown(open: boolean): void {
    //     this.open = open;
    // }

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

    public set open(value: boolean) {
        this.internalOpen = value;
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

    public set model(value: any) {
        this.preventBlur = true;
        this.internalValue = value;
        this.$emit('input', value);
        this.dirty = false;
        this.internalOpen = false;
    }

    public get focused(): any {
        return this.focusedIndex > -1 ? this.internalItems[this.focusedIndex].value : this.model;
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
        this.focusedIndex = -1;
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

    // private filterDropdown(text: string): void {
    //     // this.dirty = true;
    //     // console.log('dirty');
    //     // // this.$emit('filter', normalizeString(text.trim()));
    // }

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

    private onTab(event: Event): void {
        console.log('tab');
    }

    private onFocus(event: Event): void {
        console.log('focu');
        // this.toggleDropdown(true);
        this.open = true;
    }

    private onBlur(event): void {
        console.log('blu', this.preventBlur);
        this.preventBlur = false;
        if (!this.editable) {
            this.open = false;
        }

        //     setTimeout(() => { // Wait that the dropdown is closed before clearing
        //         this.$emit('filter'); // Clear filter
        //         this.$emit('focus'); // Clear focus
        //     }, 300);
    }

    private onMousedown(event): void {
        this.open = !this.open;
    }

    private clearField(): void {
        this.$emit('input');
    }

    private onKeydown($event: KeyboardEvent): void {
        // this.itemsFocusable = (this.items as MDropDownItemInterface[]).filter(item => (item.disabled === false && item.visible === true));

        switch ($event.keyCode) {
            case KeyCode.M_ENTER:
            case KeyCode.M_RETURN:
                console.log('return');
                if (this.focusedIndex > -1) {
                    let item: MDropdownItem = this.internalItems[this.focusedIndex];
                    this.model = item.value;
                }
                // this.internalOpen = false;
                // let currentFocus: Vue | undefined = this.getFocusItem();
                // if (currentFocus) {
                //     this.$emit('keyPressEnter', currentFocus);
                // }
                break;
            case KeyCode.M_SPACE:
                console.log('space');
                // if (!this.internalOpen) {
                //     this.internalOpen = true;
                // }
                break;
            case KeyCode.M_ESCAPE:
                console.log('escape');
                this.open = false;
                break;
            case KeyCode.M_UP:
                console.log('up');
                if (!this.open) {
                    this.focusedIndex = -1;
                    this.open = true;
                } else {
                    this.focusPreviousItem();
                }
                break;
            case KeyCode.M_DOWN:
                console.log('down');
                if (!this.open) {
                    this.focusedIndex = -1;
                    this.open = true;
                } else {
                    this.focusNextItem();
                }
                break;
            case KeyCode.M_PAGE_UP:
                console.log('pageup');
                // if (this.internalOpen) {
                //     this.getPreviousFocusItem(this.getFocusItem(), PAGE_STEP);
                // }
                break;
            case KeyCode.M_PAGE_DOWN:
                console.log('page down');
                // if (!this.internalOpen) {
                //     this.internalOpen = true;
                // } else {
                //     this.getNextFocusItem(this.getFocusItem(), PAGE_STEP);
                // }
                break;
            case KeyCode.M_HOME:
                console.log('home');
                // if (this.internalOpen) {
                //     this.getFirstFocusItem();
                // }
                break;
            case KeyCode.M_END:
                console.log('end');
                // if (!this.internalOpen) {
                //     this.internalOpen = true;
                // } else {
                //     this.getLastFocusItem();
                // }
                break;
        }
    }

    private onOpen(): void {
        this.focusSelected();
    }

    private focusSelected(): void {
        let selected: number = -1;
        if (this.focusedIndex == -1 && this.model) {
            this.internalItems.every((item, i) => {
                if (item.value == this.model) {
                    this.focusedIndex = i;
                    return false;
                }
                return true;
            });
        }
    }

    private focusNextItem(): void {
        if (this.focusedIndex > -1) {
            this.focusedIndex++;
            if (this.focusedIndex >= this.internalItems.length) {
                this.focusedIndex = 0;
            }
        } else {
            this.focusedIndex = 0;
        }
        this.scrollToFocused();
    }

    private focusPreviousItem(): void {
        if (this.focusedIndex > -1) {
            this.focusedIndex--;
            if (this.focusedIndex < 0) {
                this.focusedIndex = this.internalItems.length - 1;
            }
        } else {
            this.focusedIndex = this.internalItems.length - 1;
        }
        this.scrollToFocused();
    }

    private scrollToFocused(): void {
        this.$nextTick(() => {
            // console.log((this.$refs.popper as Vue).$el);
            // console.log((this.$refs.popper as Vue).$el);
            // let container: Element | null = (this.$refs.popper as Vue).$el.querySelector('.m-popup__body');
            let container: Element = document.body.getElementsByClassName('m-popup__body')[0];
            if (container) {
                let selectedItem: MDropdownItem = this.internalItems[this.focusedIndex];
                let top = selectedItem.$el.offsetTop;
                let bottom = selectedItem.$el.offsetTop + selectedItem.$el.offsetHeight;
                let viewRectTop = container.scrollTop;
                let viewRectBottom = viewRectTop + container.clientHeight;

                // console.log(top, bottom, viewRectTop, viewRectBottom);

                if (top < viewRectTop) {
                    container.scrollTop = top;
                } else if (bottom > viewRectBottom) {
                    container.scrollTop = bottom - container.clientHeight;
                }
            }
        });
    }

    // private getFocusItem(): Vue | undefined {
    //     let elementFocused: Vue | undefined = undefined;

    //     // for (let item of this.items) {
    //     //     if ((item as MDropDownItemInterface).focus) {
    //     //         elementFocused = item;
    //     //     }
    //     // }

    //     return elementFocused;
    // }

    // private getNextFocusItem(currentItem: Vue | undefined, step: number = 1): void {
    //     let index: number;

    //     if (currentItem) {
    //         index = this.itemsFocusable.indexOf(currentItem);
    //         index = index + step < this.itemsFocusable.length ? index + step : this.itemsFocusable.length - 1;
    //     } else {
    //         index = 0;
    //     }

    //     this.$emit('focus', this.itemsFocusable[index]);
    // }

    // private getPreviousFocusItem(currentItem: Vue | undefined, step: number = 1): void {
    //     let index: number;

    //     if (currentItem) {
    //         index = this.itemsFocusable.indexOf(currentItem);
    //         index = index - step >= 0 ? index - step : 0;
    //     } else {
    //         index = this.itemsFocusable.length - 1;
    //     }

    //     this.$emit('focus', this.itemsFocusable[index]);
    // }

    // private getFirstFocusItem(): void {
    //     this.$emit('focus', this.itemsFocusable[0]);
    // }

    // private getLastFocusItem(): void {
    //     this.$emit('focus', this.itemsFocusable[this.itemsFocusable.length - 1]);
    // }

    // private onDropdownToggle(): void {
    //     // this.toggleDropdown(!this.open);
    // }

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
