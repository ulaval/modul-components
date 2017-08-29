import Vue from 'vue';
import { ModulVue } from '../../utils/vue/vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dropdown.html?style=./dropdown.scss';
import { DROPDOWN_NAME } from '../component-names';
import { normalizeString } from '../../utils/str/str';
import { KeyCode } from '../../utils/keycode/keycode';
import { MDropDownItemInterface } from '../dropdown-item/dropdown-item';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';

const PAGE_STEP: number = 4;
const DROPDOWN_MAX_HEIGHT: number = 198;

export interface SelectedValue {
    key: string | undefined;
    value: any;
    label: string;
}

export interface MDropdownInterface extends Vue {
    selected: Array<SelectedValue>;
    currentElement: SelectedValue;
    addAction: boolean;
    nbItems: number;
    nbItemsVisible: number;
    multiple: boolean;
    getElement(key: string): Vue | undefined;
}

@WithRender
@Component({
    mixins: [
        InputState,
        MediaQueries
    ]
})
export class MDropdown extends ModulVue implements MDropdownInterface {

    @Prop()
    public label: string;
    @Prop()
    public defaultText: string;
    @Prop()
    public defaultValue: any;
    @Prop({ default: false })
    public open: boolean;
    @Prop({ default: false })
    public disabled: boolean;
    @Prop({ default: false })
    public editable: boolean;
    @Prop({ default: false })
    public multiple: boolean;
    @Prop({ default: '200px' })
    public width: string;
    @Prop({ default: false })
    public defaultFirstElement: boolean;
    @Prop()
    public textNoData: string;
    @Prop()
    public textNoMatch: string;

    public componentName: string = DROPDOWN_NAME;

    public selected: Array<SelectedValue> = [];
    public currentElement: SelectedValue = { 'key': undefined, 'value': undefined, 'label': '' };
    public addAction: true;
    public nbItems: number = 0;
    public nbItemsVisible: number = 0;
    public selectedText: string = '';
    private internalOpen: boolean = false;

    public getElement(key: string): Vue | undefined {
        let element: Vue | undefined;

        for (let child of this.$children) {
            if (child.$options.name == 'MPopper' && child.$el.nodeName != '#comment') {
                element = this.recursiveGetElement(key, child);
                break;
            }
        }
        return element;
    }

    protected mounted(): void {
        this.propOpen = this.open;
        // Obtenir le premier dropdown-item
        if (this.defaultFirstElement && !this.multiple && !this.disabled) {
            let firstElement: Vue | undefined = this.getFirstElement();
            if (firstElement) {
                (firstElement as MDropDownItemInterface).onSelectElement();
            }
        }
    }

    @Watch('selected')
    private selectedChanged(value): void {
        let values: any[] = [];

        for (let selectedValue of this.selected) {
            values.push(selectedValue.value);
        }

        if (value.length == 0 && this.defaultValue) {
            values.push(this.defaultValue);
        }

        this.$emit('change', values, this.addAction);
    }

    @Watch('currentElement')
    private currentElementChanged(value): void {
        this.selectedText = '';
        for (let item of this.selected) {
            if (this.selectedText != '') {
                this.selectedText += ', ';
            }
            this.selectedText += item.label;
        }
        this.$emit('elementSelected', this.currentElement.value, this.addAction);
    }

    @Watch('open')
    private openChanged(open: boolean): void {
        this.propOpen = open;
    }

    private get propOpen(): boolean {
        return this.internalOpen;
    }

    private set propOpen(open: boolean) {
        this.internalOpen = open != undefined ? open : false;
        this.$nextTick(() => {
            if (open) {
                this.$el.style.zIndex = '10';
                this.setDropdownElementFocus();
                this.$emit('open');
            } else {
                this.$el.style.removeProperty('z-index');
                this.$emit('close');
            }
        });
    }

    private get propEditable(): boolean {
        return this.editable && this.selected.length == 0;
    }

    private get propTextNoData(): string {
        if (this.textNoData) {
            return this.textNoData;
        } else {
            return this.$i18n.translate('m-dropdown:no-data');
        }
    }

    private get propTextNoMatch(): string {
        if (this.textNoMatch) {
            return this.textNoMatch;
        } else {
            return this.$i18n.translate('m-dropdown:no-result');
        }
    }

    private get propWidth(): string {
        if (this.as<MediaQueriesMixin>().isMqMaxS) {
            return '100%';
        } else {
            return this.width;
        }
    }

    private recursiveGetElement(key: string, node: Vue): Vue | undefined {
        let element: Vue | undefined;

        for (let child of node.$children) {
            if (child.$options.name == 'MDropdownGroup') {
                element = this.recursiveGetElement(key, child);
                if (element) {
                    return element;
                }
            } else if (child.$options.name == 'MDropdownItem' && child.$el.nodeName != '#comment' && child.$el.attributes['data-key'].value == key) {
                return child;
            }
        }
        return element;
    }

    private getFirstElement(): Vue | undefined {
        let firstElement: Vue | undefined;

        for (let child of this.$children) {
            if (child.$options.name == 'MPopper' && child.$el.nodeName != '#comment') {
                firstElement = this.recursiveGetFirstElement(child);
                break;
            }
        }
        return firstElement;
    }

    private recursiveGetFirstElement(node: Vue): Vue | undefined {
        let firstElement: Vue | undefined;

        for (let child of node.$children) {
            if (child.$options.name == 'MDropdownGroup') {
                firstElement = this.recursiveGetFirstElement(child);
                if (firstElement) {
                    return firstElement;
                }
            } else if (child.$options.name == 'MDropdownItem' && child.$el.nodeName != '#comment') {
                return child;
            }
        }
        return firstElement;
    }

    private filterDropdown(text: string): void {
        if (this.selected.length == 0) {
            for (let child of this.$children) {
                if (child.$options.name == 'MPopper' && child.$el.nodeName != '#comment') {
                    this.propagateTextFilter(normalizeString(text.trim()), child);
                }
            }
        }
    }

    private propagateTextFilter(text: string, node: Vue): void {
        for (let child of node.$children) {
            if (child.$options.name == 'MDropdownGroup') {
                this.propagateTextFilter(text, child);
            } else if (child.$options.name == 'MDropdownItem' && child.$el.nodeName != '#comment') {
                (child as MDropDownItemInterface).filter = text;
            }
        }
    }

    private setDropdownElementFocus(): void {
        // if (!this.as<DropdownTemplateMixin>().editable) {
        //     let element: HTMLElement = this.$el.querySelector(`.is-selected a`) as HTMLElement;
        //     if (element) {
        //         element.focus();
        //     }
        // }
    }

    private keyupReference($event): void {
        if (!this.propOpen && ($event.keyCode == KeyCode.M_DOWN || $event.keyCode == KeyCode.M_SPACE)) {
            $event.preventDefault();
            (this.$refs.mDropdownValue as Vue).$el.click();
        }

        if (this.propOpen && ($event.keyCode == KeyCode.M_DOWN || $event.keyCode == KeyCode.M_END || $event.keyCode == KeyCode.M_PAGE_DOWN)) {
            $event.preventDefault();
            let htmlElement: HTMLElement = this.$el.querySelector(`[data-index='0']`) as HTMLElement;
            if (htmlElement) {
                htmlElement.focus();
            }
        }
    }

    private keyupItem($event: KeyboardEvent, index: number): void {
        let selector: string = '';
        switch ($event.keyCode) {
            case KeyCode.M_UP:
                if (index == 0) {
                    selector = `[data-index='0']`;
                } else {
                    selector = `[data-index='${index - 1}']`;
                }
                break;
            case KeyCode.M_HOME:
                selector = `[data-index='0']`;
                break;
            case KeyCode.M_PAGE_UP:
                index -= PAGE_STEP;
                if (index < 0) {
                    index = 0;
                }
                selector = `[data-index='${index}']`;
                break;
            // case KeyCode.M_DOWN:
            //     if (index == this.elementsSortedFiltered.length - 1) {
            //         selector = `[data-index='${this.elementsSortedFiltered.length - 1}']`;
            //     } else {
            //         selector = `[data-index='${index + 1}']`;
            //     }
            //     break;
            // case KeyCode.M_END:
            //     selector = `[data-index='${this.elementsSortedFiltered.length - 1}']`;
            //     break;
            // case KeyCode.M_PAGE_DOWN:
            //     index += PAGE_STEP;
            //     if (index >= this.elementsSortedFiltered.length) {
            //         index = this.elementsSortedFiltered.length - 1;
            //     }
            //     selector = `[data-index='${index}']`;
            //     break;
            case KeyCode.M_ENTER:
            case KeyCode.M_RETURN:
                let element: HTMLElement = this.$el.querySelector(`[data-index='${index}']`) as HTMLElement;
                if (element) {
                    element.click();
                }
                return;
        }

        if (selector.trim() != '') {
            let element: HTMLElement = this.$el.querySelector(selector) as HTMLElement;
            if (element) {
                element.focus();
            }
        }
    }

    private animEnter(el: HTMLElement, done: any): void {
        this.$nextTick(() => {
            let height: number = el.clientHeight > DROPDOWN_MAX_HEIGHT ? DROPDOWN_MAX_HEIGHT : el.clientHeight;
            let transition: string = '0.3s max-height ease';
            el.style.transition = transition;
            el.style.webkitTransition = transition;
            el.style.overflowY = 'hidden';
            el.style.maxHeight = '0';
            el.style.width = this.width;
            setTimeout(() => {
                el.style.maxHeight = height + 'px';
                done();
            }, 0);
        });

    }

    private animAfterEnter(el: HTMLElement): void {
        setTimeout(() => {
            el.style.maxHeight = DROPDOWN_MAX_HEIGHT + 'px';
            el.style.overflowY = 'auto';
        }, 300);
    }

    private animLeave(el: HTMLElement, done: any): void {
        this.$nextTick(() => {
            let height: number = el.clientHeight;
            el.style.maxHeight = height + 'px';
            el.style.overflowY = 'hidden';
            el.style.maxHeight = '0';
            setTimeout(() => {
                el.style.maxHeight = 'none';
                done();
            }, 300);
        });
    }
}

const DropdownPlugin: PluginObject<any> = {
    install(v, options) {
        v.component(DROPDOWN_NAME, MDropdown);
    }
};

export default DropdownPlugin;
