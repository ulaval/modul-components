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
    setFocus(item: Vue): void;
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
    public open: boolean;
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
    public nbItemsVisible: number = 0;

    private selectedText: string = '';
    private hasModel: boolean = true;
    private internalOpen: boolean = false;
    private noItemsLabel: string;
    private dirty: boolean = false;

    private textFieldLabelEl: HTMLElement;
    private textFieldInputValueEl: HTMLElement;

    private componentName: string = DROPDOWN_NAME;

    public setFocus(elementFocus: Vue): void {
        for (let item of this.items) {
            if (item === elementFocus) {
                (item as MDropDownItemInterface).hasFocus = true;
            } else {
                (item as MDropDownItemInterface).hasFocus = false;
            }
        }
    }

    public getFocus(): MDropDownItemInterface | undefined {
        let elementFocus: MDropDownItemInterface | undefined = undefined;

        for (let item of this.items) {
            if ((item as MDropDownItemInterface).hasFocus) {
                elementFocus = (item as MDropDownItemInterface);
                break;
            }
        }

        return elementFocus;
    }

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
        this.propOpen = open;
    }

    private mounted(): void {
        this.propOpen = this.open;
    }

    @Watch('value')
    private valueChanged(value: any): void {
        this.selectedText = '';
        this.$emit('valueChanged', value);
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    public get model(): any {
        this.hasModel = !!this.value;
        return this.value;
    }

    public get propOpen(): boolean {
        return this.internalOpen;
    }

    public set propOpen(open: boolean) {
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
        this.dirty = true;
        this.$emit('filter', normalizeString(text.trim()));
    }

    private onBlur(event): void {
        if (this.propEditable && this.dirty) {
            setTimeout(() => {
                if (!this.model || this.model == '') {
                    this.selectedText = '';
                    this.$emit('valueChanged');
                } else {
                    this.$emit('valueChanged', this.model);
                }
            }, 100);
        }
        this.dirty = false;
    }

    private onFocus(event: Event): void {
        if (this.propEditable) {
            this.dirty = true;
            this.selectedText = '';
        }
    }

    private clearField(): void {
        this.$emit('input');
    }

    private keyupReference($event): void {
        if (!this.internalOpen && ($event.keyCode == KeyCode.M_DOWN || $event.keyCode == KeyCode.M_SPACE)) {
            $event.preventDefault();
            this.propOpen = true;

            setTimeout(() => { // Wait for menu to open
                (this.$refs.mDropdownElements as HTMLElement).focus();
            }, 300);
        }

        if (this.internalOpen && ($event.keyCode == KeyCode.M_DOWN || $event.keyCode == KeyCode.M_END || $event.keyCode == KeyCode.M_PAGE_DOWN)) {
            (this.$refs.mDropdownElements as HTMLElement).focus();
        }
    }

    private keyupItem($event: KeyboardEvent): void {
        let element: Vue | undefined = undefined;
        let focusElement: MDropDownItemInterface | undefined = this.getFocus();
        let itemsEnabled: MDropDownItemInterface[] = (this.items as MDropDownItemInterface[]).filter(item => (item.disabled === false && item.visible === true));

        switch ($event.keyCode) {
            case KeyCode.M_UP:
                if (focusElement) {
                    let index: number = itemsEnabled.indexOf(focusElement);
                    if (index == 0) {
                        element = itemsEnabled[0];
                    } else {
                        element = itemsEnabled[index - 1];
                    }
                } else {
                    element = itemsEnabled[0];
                }
                break;
            case KeyCode.M_HOME:
                element = itemsEnabled[0];
                break;
            case KeyCode.M_PAGE_UP:
                if (focusElement) {
                    let index: number = itemsEnabled.indexOf(focusElement);
                    index -= PAGE_STEP;

                    if (index < 0) {
                        element = itemsEnabled[0];
                    } else {
                        element = itemsEnabled[index];
                    }
                } else {
                    element = itemsEnabled[0];
                }
                break;
            case KeyCode.M_DOWN:
                if (focusElement) {
                    let index: number = itemsEnabled.indexOf(focusElement);
                    if (index == itemsEnabled.length - 1) {
                        element = itemsEnabled[itemsEnabled.length - 1];
                    } else {
                        element = itemsEnabled[index + 1];
                    }
                } else {
                    element = itemsEnabled[0];
                }
                break;

            case KeyCode.M_END:
                element = itemsEnabled[itemsEnabled.length - 1];
                break;
            case KeyCode.M_PAGE_DOWN:
                if (focusElement) {
                    let index: number = itemsEnabled.indexOf(focusElement);
                    index += PAGE_STEP;

                    if (index > itemsEnabled.length - 1) {
                        element = itemsEnabled[itemsEnabled.length - 1];
                    } else {
                        element = itemsEnabled[index];
                    }
                } else {
                    let index: number = (PAGE_STEP < itemsEnabled.length ? PAGE_STEP - 1 : itemsEnabled.length - 1);
                    element = itemsEnabled[index];
                }
                break;
            case KeyCode.M_ENTER:
            case KeyCode.M_RETURN:
                if (focusElement) {
                    this.$emit('keyPressEnter', (focusElement as MDropDownItemInterface).propValue);
                }
                return;
        }

        if (element) {
            element.$el.focus();
        }
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
