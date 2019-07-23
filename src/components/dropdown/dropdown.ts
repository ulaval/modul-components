import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop, Watch } from 'vue-property-decorator';
import PopupPluginDirective from '../../directives/popup/popup';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputPopup } from '../../mixins/input-popup/input-popup';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import MediaQueriesPlugin from '../../utils/media-queries/media-queries';
import { normalizeString } from '../../utils/str/str';
import UserAgentUtil from '../../utils/user-agent/user-agent';
import uuid from '../../utils/uuid/uuid';
import ButtonPlugin from '../button/button';
import { DROPDOWN_ITEM_NAME, DROPDOWN_NAME } from '../component-names';
import { MDropdownGroup } from '../dropdown-group/dropdown-group';
import InputStylePlugin, { MInputStyle } from '../input-style/input-style';
import PopupPlugin, { MPopup } from '../popup/popup';
import RadioStylePlugin from '../radio-style/radio-style';
import { MSidebar } from '../sidebar/sidebar';
import ValidationMessagePlugin from '../validation-message/validation-message';
import { InputManagement } from './../../mixins/input-management/input-management';
import { BaseDropdown, BaseDropdownGroup, MDropdownInterface, MDropdownItem } from './dropdown-item/dropdown-item';
import WithRender from './dropdown.html?style=./dropdown.scss';

const DROPDOWN_STYLE_TRANSITION: string = 'max-height 0.3s ease';

@WithRender
@Component({
    mixins: [
        InputState,
        InputPopup,
        MediaQueries,
        InputManagement,
        InputWidth,
        InputLabel
    ]
})
export class MDropdown extends BaseDropdown implements MDropdownInterface {
    @Model('change')
    @Prop()
    public value: any;
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
    @Prop()
    public forceOpen: boolean;
    @Prop()
    public maxLength: number;
    @Prop({ default: true })
    public showArrowIcon: boolean;
    @Prop({ default: true })
    public enableAnimation: boolean;
    @Prop({ default: true })
    public includeFilterableStatusItems: boolean;
    @Prop({ default: false })
    public clearInvalidSelectionOnClose: boolean;
    @Prop({ default: true })
    public clearModelOnSelectedText: boolean;

    public $refs: {
        popup: MPopup;
        items: HTMLUListElement;
        input: HTMLInputElement;
        mInputStyle: MInputStyle;
        researchInput: HTMLInputElement;
    };

    private internalFilter: string = '';
    private internalFilterRegExp: RegExp = / /;

    private internalItems: MDropdownItem[] = [];
    private internalNavigationItems: MDropdownItem[];
    private internalSelectedText: string | undefined = '';
    private internalIsFocus: boolean = false;
    private observer: MutationObserver;
    private focusedIndex: number = -1;

    private internalOpen: boolean = false;
    private dirty: boolean = false;
    private id: string = `mDropdown-${uuid.generate()}`;
    private itemsHeightStyleInternal: number | object | undefined = {};

    @Watch('forceOpen')
    onForceOpenUpdate(): void {
        if (this.forceOpen) {
            this.internalOpen = this.forceOpen;
        }
    }

    public matchFilter(text: string | undefined): boolean {
        let result: boolean = true;
        if (text !== undefined && this.dirty && (this.internalFilterRegExp)) {
            result = this.internalFilterRegExp.test(text);
        }
        return result;
    }

    public onFocusIn(): void {
        if (!this.filterable) {
            this.$refs.input.setSelectionRange(0, 0);
        }
        this.internalIsFocus = true;
    }

    public onFocusOut(): void {
        this.internalIsFocus = false;
    }

    public groupHasItems(group: BaseDropdownGroup): boolean {
        return this.internalItems.some(i => {
            return i.group === group;
        });
    }

    protected created(): void {
        this.setInternalValue(this.value);
    }

    protected mounted(): void {
        if (this.focus) {
            this.focusChanged(this.focus);
        }
    }

    protected beforeDestroy(): void {
        if (this.observer) { this.observer.disconnect(); }
    }

    public get open(): boolean {
        return this.internalOpen;
    }

    public set open(value: boolean) {
        if (value && value !== this.internalOpen) {
            this.focusedIndex = -1;
        }
        if (this.as<InputState>().active) {
            this.internalOpen = value;
        }
    }

    @Emit('open')
    private async onOpen(): Promise<void> {
        await this.$nextTick();
        let inputEl: any = this.$refs.input;
        setTimeout(() => { // Need timeout to set focus on input
            inputEl.focus();
        });

        this.focusSelected();
        this.scrollToFocused();
        // Reset the height of the list before calculating its height
        // (this code is executed before the method calculateFilterableListeHeight())
        this.itemsHeightStyle = undefined;
    }

    @Emit('close')
    private onClose(): void {
        const hasMatch: boolean = this.matchFilterTextToValue();
        this.internalFilter = '';
        if (this.clearInvalidSelectionOnClose && !hasMatch && this.selectedText === '') {
            this.$emit('input', '');
            this.setModel('', true);
        }
    }

    private set itemsHeightStyle(value: object | number | undefined) {
        this.itemsHeightStyleInternal = value === undefined ? undefined : { height: value + 'px' };
    }

    private get itemsHeightStyle(): object | number | undefined {
        return this.itemsHeightStyleInternal;
    }

    private calculateFilterableListeHeight(): void {
        // To display the contents of the list above the device keyboard,
        // fixed the height of the list when the dropdown is filterable and in mobile mode.
        if (this.filterable && !UserAgentUtil.isAndroid() && this.as<MediaQueries>().isMqMaxS) {
            this.$children.forEach((popup, index) => {

                // Find the MPopup component that has the MSidebar child component
                if (popup.$options.name === MPopup.name) {
                    popup.$children.forEach((sidebar, index) => {
                        if (sidebar.$options.name === MSidebar.name) {
                            // Set height of the list with height of MSidebar body
                            let sidebarComponent: MSidebar = sidebar as MSidebar;
                            this.itemsHeightStyle = sidebarComponent.$refs.body.clientHeight;
                            sidebarComponent.$refs.body.style.overflow = 'hidden';
                        }
                    });
                }
            });
        }
    }

    @Watch('value')
    private setInternalValue(value: any): void {
        this.setModel(value, false);
    }

    @Watch('focus')
    private focusChanged(focus: boolean): void {
        if (focus && !this.as<InputStateMixin>().isDisabled) {
            this.selectText();
        } else {
            this.$refs.input.blur();
            this.internalOpen = false;
        }
    }

    private matchFilterTextToValue(): boolean {
        if (this.filterable && this.internalFilter !== '') {
            let value: string = '';
            this.internalItems.every(item => {
                if (item.propLabel === this.internalFilter) {
                    value = item.value;
                    return false;
                }
                return true;
            });
            if (value !== '') {
                this.model = value;
                return true;
            }
        }
        return false;
    }

    public get model(): any {
        return this.value === undefined ? this.as<InputPopup>().internalValue : this.value;
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

    private get internalPlaceholder(): string {
        if (this.as<InputState>().isReadonly) {
            return '';
        } else {
            return this.as<InputManagement>().placeholder;
        }
    }

    private get internallLabelUp(): boolean {
        if (this.as<InputState>().isReadonly) {
            return true;
        } else {
            return this.as<InputLabel>().labelUp;
        }
    }

    private portalMounted(): void {
        this.buildItemsMap();

        this.observer = new MutationObserver(() => {
            this.buildItemsMap();
        });

        if (this.$refs.items) {
            // todo: mobile
            this.observer.observe(this.$refs.items, { subtree: true, childList: true });
        }
    }

    private setInputWidth(): void {
        this.$nextTick(() => {
            this.$refs.mInputStyle.setInputWidth();
        });
    }

    private get inputStyletWidth(): string {
        return this.as<InputWidth>().inputWidth === 'auto' && this.as<InputWidth>().maxWidth === 'none' ? 'auto' : '100%';
    }

    public get focused(): any {
        return this.focusedIndex > -1 ? this.internalNavigationItems[this.focusedIndex].value : this.model;
    }

    @Watch('isMqMaxS')
    private onIsMqMaxS(value: boolean, old: boolean): void {
        if (value !== old) {
            this.$nextTick(() => this.buildItemsMap());
        }
    }

    private get selectedText(): string {
        let result: string | undefined = '';
        if (this.dirty || this.internalFilter) {
            result = this.internalFilter;
        } else if (this.internalItems.every(item => {
            if (item.value === this.model) {
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
        if (this.clearModelOnSelectedText) {
            this.$emit('change', '');
            this.as<InputPopup>().internalValue = value;
        }
        this.internalFilter = value;
        let parsedQuery: string = normalizeString(this.internalFilter).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
        this.internalFilterRegExp = new RegExp(parsedQuery, 'i');
    }

    public get isEmpty(): boolean {
        return (this.filterable && this.open) || this.as<InputManagement>().hasValue || (this.as<InputPopup>().hasPlaceholder() && this.open) ? false : true;
    }

    private buildItemsMap(): void {
        this.focusedIndex = -1;

        // all visible items
        let items: MDropdownItem[] = [];
        // items that can be reached with the keyboard (!disabled)
        let navigation: MDropdownItem[] = [];
        this.$refs.popup.$children[0].$children.forEach(item => {
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

    private get ariaControls(): string {
        return this.id + '-controls';
    }

    public get inactive(): boolean {
        return this.as<InputState>().isDisabled || this.as<InputState>().isReadonly || this.as<InputState>().isWaiting;
    }

    private get hasFooterSlot(): boolean {
        return !!this.$slots.footer;
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
        this.selectText();
    }

    private onKeydownTab($event: KeyboardEvent): void {
        if (this.as<MediaQueries>().isMqMinS) {
            if (this.focusedIndex > -1 && this.internalItems.length === 1) {
                let item: MDropdownItem = this.internalNavigationItems[this.focusedIndex];
                this.model = item.value;
            }
            this.open = false;
        }
    }

    private onKeydownEsc(): void {
        this.open = false;
    }

    private onInput(value: Event): void {
        this.$emit('input', (value.target as HTMLInputElement).value);
    }

    private focusOnResearchInput(): void {
        this.$refs.researchInput.focus();
    }

    private async selectText(): Promise<void> {
        await this.$nextTick();
        this.$refs.input.focus();
    }

    private focusSelected(): void {
        this.internalNavigationItems.every((item, i) => {
            if (item.value === this.model) {
                this.focusedIndex = i;
                return false;
            } else if (this.filterable && this.internalFilter !== '' && this.model === undefined) {
                this.focusedIndex = 0;
                return false;
            } else {
                this.focusedIndex = -1;
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
            this.focusedIndex = this.internalNavigationItems.length === 0 ? -1 : 0;
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
                let container: HTMLElement = this.$refs.items;
                if (container) {
                    let focusedItem: MDropdownItem = this.internalNavigationItems[this.focusedIndex];
                    let top: number = (focusedItem.$el as HTMLElement).offsetTop;
                    let bottom: number = (focusedItem.$el as HTMLElement).offsetTop + (focusedItem.$el as HTMLElement).offsetHeight;
                    let viewRectTop: number = container.scrollTop;
                    let viewRectBottom: number = viewRectTop + container.clientHeight;

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
                    // tslint:disable-next-line: deprecation
                    el.style.webkitTransition = DROPDOWN_STYLE_TRANSITION;
                    el.style.transition = DROPDOWN_STYLE_TRANSITION;
                    el.style.overflowY = 'hidden';
                    if (this.enableAnimation) {
                        el.style.maxHeight = '0';
                    }
                    el.style.width = this.$el.clientWidth + 'px';
                    el.style.minWidth = this.listMinWidth;
                    el.style.removeProperty('opacity');
                    setTimeout(() => {
                        if (this.enableAnimation) {
                            el.style.maxHeight = height + 'px';
                        }
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
                if (this.enableAnimation) {
                    el.style.maxHeight = height + 'px';
                    el.style.maxHeight = '0';
                }
                setTimeout(() => {
                    if (this.enableAnimation) {
                        el.style.maxHeight = 'none';
                    }
                    this.dirty = false;
                    this.internalFilterRegExp = / /;
                    done();
                }, 300);
            } else {
                done();
            }
        });
    }

    private get hasPointer(): boolean {
        return !this.as<InputState>().isDisabled &&
            !this.as<InputState>().isReadonly &&
            (!this.filterable || (this.filterable && !this.open));
    }

    private get hasPlaceholderIcon(): boolean {
        if (UserAgentUtil.isEdge() && !UserAgentUtil.isBlink()) {
            return this.filterable && this.selectedText === '' && !this.as<InputState>().isReadonly && this.isEdgeSupport;
        } else if (UserAgentUtil.isGecko() && !UserAgentUtil.isBlink()) {
            return this.filterable && this.selectedText === '' && !this.as<InputState>().isReadonly && this.isFirefoxSupport;
        } else {
            return this.filterable && this.selectedText === '' && !this.as<InputState>().isReadonly;
        }
    }

    private get isEdgeSupport(): boolean {
        return UserAgentUtil.isEdge() && this.as<InputManagement>().placeholder === '' || this.as<InputManagement>().placeholder === undefined;
    }

    private get isFirefoxSupport(): boolean {
        return UserAgentUtil.isGecko() && this.as<InputManagement>().placeholder === '' || this.as<InputManagement>().placeholder === undefined;
    }

}

const DropdownPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(RadioStylePlugin);
        Vue.use(InputStylePlugin);
        Vue.use(ButtonPlugin);
        Vue.use(PopupPlugin);
        Vue.use(PopupPluginDirective);
        Vue.use(ValidationMessagePlugin);
        Vue.use(MediaQueriesPlugin);
        v.component(DROPDOWN_ITEM_NAME, MDropdownItem);
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default DropdownPlugin;
