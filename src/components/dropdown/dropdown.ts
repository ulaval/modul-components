import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';
import { KeyCode } from '../../utils/keycode/keycode';
import { normalizeString } from '../../utils/str/str';
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
    @Prop({ default: DROPDOWN_MAX_WIDTH })
    public width: string;
    @Prop()
    public textNoData: string;
    @Prop()
    public textNoMatch: string;

    private internalFilter: string = '';
    private internalFilterRegExp: RegExp = / /;

    private internalValue: any | undefined = undefined;
    private internalItems: MDropdownItem[] = [];
    private internalSelectedText: string | undefined = '';
    private observer: any;
    private focusedIndex: number = -1;

    private internalOpen: boolean = false;
    private dirty: boolean = false;

    private textFieldLabelEl: HTMLElement;
    private textFieldInputValueEl: HTMLElement;

    private componentName: string = DROPDOWN_NAME;

    public filter(text: string | undefined): boolean {
        let result: boolean = true;
        if (text !== undefined && this.dirty && (this.internalFilterRegExp)) {
            result = this.internalFilterRegExp.test(text);
        }
        return result;
    }

    protected mounted(): void {
        this.$nextTick(() => {
            this.buildItemsMap();

            this.observer = new MutationObserver(function(mutations) {
                this.buildItemsMap();
            }.bind(this));

            let o: NodeListOf<Element> = document.body.getElementsByClassName('m-dropdown__list');// this.$el.querySelector('.m-popup');
            if (o.length > 0) {
                this.observer.observe(o[0], { childList: true }
                );
            }

            console.log(this.$children);
        });
    }

    public get open(): boolean {
        return this.internalOpen;
    }

    public set open(value: boolean) {
        if (value && value != this.internalOpen) {
            this.focusedIndex = -1;
        }
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
                result = ''; // item.propLabel;
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
        let parsedQuery = normalizeString(this.internalFilter).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
        this.internalFilterRegExp = new RegExp(parsedQuery, 'i');
    }

    private buildItemsMap(): void {
        this.focusedIndex = -1;
        this.internalItems = (this.$refs.popper as Vue).$children[0].$children.filter(v => v instanceof MDropdownItem && !v.noDataDefaultItem && v.visible).map(v => v as MDropdownItem);
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

    private onFocus(event: Event): void {
        this.open = true;
    }

    private onBlur(event): void {
        this.open = false;
    }

    private onMousedown(event): void {
        this.open = !this.open;
    }

    private clearField(): void {
        this.$emit('input');
    }

    private onKeydownEnter($event: KeyboardEvent): void {
        if (this.focusedIndex > -1) {
            let item: MDropdownItem = this.internalItems[this.focusedIndex];
            this.model = item.value;
        }
    }

    private onKeydownEscape($event: KeyboardEvent): void {
        this.open = false;
    }

    private onKeydownUp($event: KeyboardEvent): void {
        if (!this.open) {
            this.open = true;
        } else {
            this.focusPreviousItem();
        }
    }

    private onKeydownDown($event: KeyboardEvent): void {
        if (!this.open) {
            this.open = true;
        } else {
            this.focusNextItem();
        }
    }

    private onKeydown($event: KeyboardEvent): void {
        if ($event.keyCode != KeyCode.M_RETURN &&
            $event.keyCode != KeyCode.M_ENTER &&
            $event.keyCode != KeyCode.M_TAB &&
            $event.keyCode != KeyCode.M_ESCAPE && !this.open) {
            this.focusedIndex = -1;
            this.open = true;
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
            this.focusedIndex = this.internalItems.length == 0 ? -1 : 0;
        }
        if (this.focusedIndex > -1) {
            this.scrollToFocused();
        }
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
        if (this.focusedIndex > -1) {
            this.scrollToFocused();
        }
    }

    private scrollToFocused(): void {
        this.$nextTick(() => {
            let container: Element = document.body.getElementsByClassName('m-popup__body')[0];
            if (container) {
                let selectedItem: MDropdownItem = this.internalItems[this.focusedIndex];
                let top = selectedItem.$el.offsetTop;
                let bottom = selectedItem.$el.offsetTop + selectedItem.$el.offsetHeight;
                let viewRectTop = container.scrollTop;
                let viewRectBottom = viewRectTop + container.clientHeight;

                if (top < viewRectTop) {
                    container.scrollTop = top;
                } else if (bottom > viewRectBottom) {
                    container.scrollTop = bottom - container.clientHeight;
                }
            }
        });
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
