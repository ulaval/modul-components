import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Watch } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';
import { KeyCode } from '../../utils/keycode/keycode';
import { normalizeString } from '../../utils/str/str';
import { MDropdownInterface, MDropdownItem, BaseDropdown, BaseDropdownGroup } from '../dropdown-item/dropdown-item';
import { MDropdownGroup } from '../dropdown-group/dropdown-group';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import i18nPlugin from '../../utils/i18n/i18n';
import DropdownItemPlugin from '../dropdown-item/dropdown-item';
import ButtonPlugin from '../button/button';
import TextFieldPlugin from '../text-field/text-field';
import ValidationMessagePlugin from '../validation-message/validation-message';
import PopupPlugin from '../popup/popup';

const DROPDOWN_MAX_HEIGHT: string = '220px';
const DROPDOWN_MAX_WIDTH: string = '288px'; // 320 - (16*2)
const TEXTFIELD_MIN_WIDTH: string = '130px'; // from text-field.scss
const DROPDOWN_STYLE_TRANSITION: string = 'max-height 0.3s ease';

@WithRender
@Component({
    mixins: [
        InputState,
        MediaQueries
    ]
})
export class MDropdown extends BaseDropdown implements MDropdownInterface {
    @Model('change')
    @Prop()
    public value: any;
    @Prop()
    public label: string;
    @Prop()
    public placeholder: string;
    @Prop({ default: false })
    public waiting: boolean;
    @Prop({ default: false })
    public filterable: boolean;
    @Prop({ default: DROPDOWN_MAX_WIDTH })
    public width: string;
    @Prop()
    public textNoData: string;
    @Prop()
    public textNoMatch: string;

    private internalFilter: string = '';
    private internalFilterRegExp: RegExp = / /;

    private internalValue: any | undefined = '';
    private internalItems: MDropdownItem[] = [];
    private internalNavigationItems: MDropdownItem[];
    private internalSelectedText: string | undefined = '';
    private observer: any;
    private focusedIndex: number = -1;

    private internalOpen: boolean = false;
    private dirty: boolean = false;

    private mouseIsDown: boolean = false;

    private maxHeight: string = DROPDOWN_MAX_HEIGHT;

    public matchFilter(text: string | undefined): boolean {
        let result: boolean = true;
        if (text !== undefined && this.dirty && (this.internalFilterRegExp)) {
            result = this.internalFilterRegExp.test(text);
        }
        return result;
    }

    public groupHasItems(group: BaseDropdownGroup): boolean {
        return this.internalItems.some(i => {
            return i.group == group;
        });
    }

    public focus(): void {
        ((this.$refs.mDropdownTextField as Vue).$el.querySelector('input') as HTMLElement).focus();
    }

    protected mounted(): void {
        this.$nextTick(() => {
            this.buildItemsMap();

            this.observer = new MutationObserver(function(mutations) {
                this.buildItemsMap();
            }.bind(this));

            if (this.$refs.items) {
                // todo: mobile
                this.observer.observe(this.$refs.items as HTMLUListElement, { subtree: true, childList: true });
            }
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
            let inputEl: any = this.$refs.input;
            if (this.internalOpen) {
                this.$emit('open');
                inputEl.focus();
                if (this.filterable) {
                    inputEl.setSelectionRange(0, this.selectedText.length);
                }
                this.scrollToFocused();
            } else {
                this.$emit('close');
            }
        });
    }

    @Watch('value')
    private setInternalValue(value: any): void {
        this.internalValue = value;
    }

    public get model(): any {
        return this.value == undefined ? this.internalValue : this.value;
    }

    public set model(value: any) {
        this.internalValue = value;
        this.$emit('change', value);
        this.dirty = false;
        this.internalOpen = false;
    }

    public get focused(): any {
        return this.focusedIndex > -1 ? this.internalNavigationItems[this.focusedIndex].value : this.model;
    }

    @Watch('isMqMaxS')
    private onisMqMaxS(value: boolean, old: boolean): void {
        if (value != old) {
            this.$nextTick(() => this.buildItemsMap());
        }
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
        let parsedQuery = normalizeString(this.internalFilter).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
        this.internalFilterRegExp = new RegExp(parsedQuery, 'i');
    }

    public get isEmpty(): boolean {
        return (this.filterable && this.open) || this.hasValue || (this.hasPlaceholder() && this.open) ? false : true;
    }

    private get hasValue(): boolean {
        return this.selectedText != undefined && this.selectedText != '';
    }

    private hasPlaceholder(): boolean {
        return this.placeholder != undefined && this.placeholder != '';
    }

    private buildItemsMap(): void {
        this.focusedIndex = -1;

        // all visible items
        let items: MDropdownItem[] = [];
        // items that can be reached with the keyboard (!disabled)
        let navigation: MDropdownItem[] = [];
        (this.$refs.popup as Vue).$children[0].$children.forEach(item => {
            if (item instanceof MDropdownItem && !item.inactive && !item.filtered) {
                items.push(item);
                if (!item.disabled) {
                    navigation.push(item);
                }
            } else if (item instanceof MDropdownGroup) {
                (item as Vue).$children.forEach(groupItem => {
                    if (groupItem instanceof MDropdownItem && !groupItem.inactive && !groupItem.filtered) {
                        items.push(groupItem);
                        if (!groupItem.disabled) {
                            navigation.push(groupItem);
                        }
                    }
                });
            }
        });
        this.internalItems = items;
        this.internalNavigationItems = navigation;
    }

    private get propTextNoData(): string {
        return (this.textNoData ? this.textNoData : this.$i18n.translate('m-dropdown:no-data'));
    }

    private get propTextNoMatch(): string {
        return (this.textNoMatch ? this.textNoMatch : this.$i18n.translate('m-dropdown:no-result'));
    }

    private get propMaxHeight(): string | undefined {
        return this.as<MediaQueries>().isMqMinS ? this.maxHeight : undefined;
    }

    private get hasItems(): boolean {
        return this.internalItems.length > 0;
    }

    private get noItemsLabel(): string {
        return (!this.internalItems || this.internalItems.length == 0) ? this.propTextNoData : this.propTextNoMatch;
    }

    public get inactive(): boolean {
        return this.as<InputState>().isDisabled || this.waiting;
    }

    public get hasLabel(): boolean {
        return !!this.label;
    }

    private onKeydownEnter($event: KeyboardEvent): void {
        if (!this.open) {
            this.open = true;
        }
        if (this.focusedIndex > -1) {
            let item: MDropdownItem = this.internalNavigationItems[this.focusedIndex];
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

    private onMousedown(event): void {
        this.mouseIsDown = true;
    }

    private onMouseup(event): void {
        setTimeout(() => {
            this.mouseIsDown = false;
        }, 30);
    }

    private onOpen(): void {
        this.focusSelected();
        this.open = true;
    }

    private onFocus(): void {
        if (!this.mouseIsDown && !this.open && !this.inactive) {
            setTimeout(() => {
                this.open = true;
            }, 300);
        }
    }

    private onBlur(): void {
        if (!this.mouseIsDown && this.as<MediaQueries>().isMqMinS) {
            this.open = false;
        }
    }

    private focusOnResearchInput(): void {
        (this.$refs.researchInput as HTMLElement).focus();
    }

    private focusSelected(): void {
        if (this.focusedIndex == -1 && this.model) {
            this.internalNavigationItems.every((item, i) => {
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
            if (this.focusedIndex >= this.internalNavigationItems.length) {
                this.focusedIndex = 0;
            }
        } else {
            this.focusedIndex = this.internalNavigationItems.length == 0 ? -1 : 0;
        }
        this.scrollToFocused();
    }

    private focusPreviousItem(): void {
        if (this.focusedIndex > -1) {
            this.focusedIndex--;
            if (this.focusedIndex < 0) {
                this.focusedIndex = this.internalNavigationItems.length - 1;
            }
        } else {
            this.focusedIndex = this.internalNavigationItems.length - 1;
        }
        this.scrollToFocused();
    }

    private scrollToFocused(): void {
        if (this.focusedIndex > -1 && this.as<MediaQueriesMixin>().isMqMinS) {
            this.$nextTick(() => {
                let container: HTMLElement = this.$refs.items as HTMLElement;
                if (container) {
                    let focusedItem: MDropdownItem = this.internalNavigationItems[this.focusedIndex];
                    let top = focusedItem.$el.offsetTop;
                    let bottom = focusedItem.$el.offsetTop + focusedItem.$el.offsetHeight;
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
    }

    private transitionEnter(el: HTMLElement, done: any): void {
        this.$nextTick(() => {
            el.style.opacity = '0';
            el.style.width = this.$el.clientWidth + 'px';
            setTimeout(() => {
                if (this.as<MediaQueriesMixin>().isMqMinS) {
                    let height: number = el.clientHeight;
                    el.style.webkitTransition = DROPDOWN_STYLE_TRANSITION;
                    el.style.transition = DROPDOWN_STYLE_TRANSITION;
                    el.style.removeProperty('opacity');
                    el.style.overflowY = 'hidden';
                    el.style.maxHeight = '0';
                    setTimeout(() => {
                        el.style.maxHeight = height + 'px';
                        done();
                    }, 0);
                } else {
                    done();
                }
            }, 0);
        });
    }

    private transitionLeave(el: HTMLElement, done: any): void {
        this.$nextTick(() => {
            if (this.as<MediaQueriesMixin>().isMqMinS) {
                let height: number = el.clientHeight;
                el.style.width = this.$el.clientWidth + 'px';
                el.style.maxHeight = height + 'px';
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

    private get computedWidth(): string {
        if (this.width == 'min') {
            return TEXTFIELD_MIN_WIDTH;
        } else if (this.width == 'max') {
            return DROPDOWN_MAX_WIDTH;
        } else {
            return this.width;
        }
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
