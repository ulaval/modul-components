import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Model, Watch } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';
import { KeyCode } from '../../utils/keycode/keycode';
import { normalizeString } from '../../utils/str/str';
import DropdownItemPlugin, { MDropdownInterface, MDropdownItem, BaseDropdown, BaseDropdownGroup } from '../dropdown-item/dropdown-item';
import { MDropdownGroup } from '../dropdown-group/dropdown-group';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { InputPopup } from '../../mixins/input-popup/input-popup';
import { InputWidth, InputMaxWidth } from '../../mixins/input-width/input-width';
import { InputLabel } from '../../mixins/input-label/input-label';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import i18nPlugin from '../../utils/i18n/i18n';
import ButtonPlugin from '../button/button';
import InputStylePlugin, { MInputStyle } from '../input-style/input-style';
import ValidationMessagePlugin from '../validation-message/validation-message';
import PopupPlugin from '../popup/popup';
import PopupPluginDirective from '../../directives/popup/popup';

const DROPDOWN_MAX_WIDTH: string = '288px'; // 320 - (16*2)
const DROPDOWN_STYLE_TRANSITION: string = 'max-height 0.3s ease';

@WithRender
@Component({
    mixins: [
        InputState,
        InputPopup,
        MediaQueries,
        InputWidth,
        InputLabel
    ]
})
export class MDropdown extends BaseDropdown implements MDropdownInterface {
    @Model('change')
    @Prop()
    public value: any;
    @Prop()
    public placeholder: string;
    @Prop()
    public filterable: boolean;
    @Prop()
    public textNoData: string;
    @Prop()
    public textNoMatch: string;
    @Prop()
    public listMinWidth: string;
    @Prop()
    public focus: boolean;

    private internalFilter: string = '';
    private internalFilterRegExp: RegExp = / /;

    private internalItems: MDropdownItem[] = [];
    private internalNavigationItems: MDropdownItem[];
    private internalSelectedText: string | undefined = '';
    private observer: any;
    private focusedIndex: number = -1;

    private internalOpen: boolean = false;
    private dirty: boolean = false;

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

    protected created(): void {
        this.setInternalValue(this.value);
    }

    protected mounted(): void {
        if (this.focus) {
            this.focusChanged(this.focus);
        }
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
                inputEl.focus();
                if (this.filterable) {
                    inputEl.setSelectionRange(0, this.selectedText.length);
                }
                this.focusSelected();
                this.scrollToFocused();
                this.$emit('open');
            } else {
                this.$emit('close');
            }
        });
    }

    @Watch('value')
    private setInternalValue(value: any): void {
        this.setModel(value, false);
    }

    @Watch('focus')
    private focusChanged(focus: boolean): void {
        if (focus && !this.as<InputStateMixin>().isDisabled) {
            (this.$refs.input as HTMLElement).focus();
        } else {
            (this.$refs.input as HTMLElement).blur();
            this.internalOpen = false;
        }
    }

    public get model(): any {
        return this.value == undefined ? this.as<InputPopup>().internalValue : this.value;
    }

    public set model(value: any) {
        this.setModel(value, true);
    }

    private setModel(value: any, emit: boolean): void {
        this.as<InputPopup>().internalValue = value;
        if (emit) {
            this.$emit('change', value);
        }
        this.dirty = false;
        this.internalOpen = false;
        this.setInputWidth();
    }

    private setInputWidth(): void {
        this.$nextTick(() => {
            (this.$refs.mInputStyle as MInputStyle).setInputWidth();
        });
    }

    private get inputStyletWidth(): string {
        return this.as<InputWidth>().inputWidth == 'auto' && this.as<InputWidth>().maxWidth == 'none' ? 'auto' : '100%';
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
        return (this.filterable && this.open) || this.as<InputPopup>().hasValue() || (this.as<InputPopup>().hasPlaceholder() && this.open) ? false : true;
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
        this.focusSelected();
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
        return this.as<InputState>().isDisabled || this.as<InputState>().isWaiting;
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

    private onKeydownEnter($event: KeyboardEvent): void {
        if (!this.open) {
            this.open = true;
        }
        if (this.focusedIndex > -1) {
            let item: MDropdownItem = this.internalNavigationItems[this.focusedIndex];
            this.model = item.value;
        }
    }

    private onKeydownTab($event: KeyboardEvent): void {
        if (this.as<MediaQueries>().isMqMinS) {
            if (this.focusedIndex > -1 && this.internalItems.length == 1) {
                let item: MDropdownItem = this.internalNavigationItems[this.focusedIndex];
                this.model = item.value;
            }
            this.open = false;
        }
    }

    private focusOnResearchInput(): void {
        (this.$refs.researchInput as HTMLElement).focus();
    }

    private focusSelected(): void {
        this.internalNavigationItems.every((item, i) => {
            if (item.value == this.model) {
                this.focusedIndex = i;
                return false;
            } else {
                this.focusedIndex = 0;
                return true;
            }
        });
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
                    el.style.overflowY = 'hidden';
                    el.style.maxHeight = '0';
                    el.style.width = this.$el.clientWidth + 'px';
                    el.style.minWidth = this.listMinWidth;
                    el.style.removeProperty('opacity');
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
                el.style.minWidth = this.listMinWidth;
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
}

const DropdownPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(DropdownItemPlugin);
        Vue.use(InputStylePlugin);
        Vue.use(ButtonPlugin);
        Vue.use(PopupPlugin);
        Vue.use(PopupPluginDirective);
        Vue.use(ValidationMessagePlugin);
        Vue.use(MediaQueriesPlugin);
        Vue.use(i18nPlugin);
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default DropdownPlugin;
