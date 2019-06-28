import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop } from 'vue-property-decorator';
import { InputLabel } from '../../mixins/input-label/input-label';
import { InputManagement } from '../../mixins/input-management/input-management';
import { InputState } from '../../mixins/input-state/input-state';
import { InputWidth } from '../../mixins/input-width/input-width';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import uuid from '../../utils/uuid/uuid';
import { ModulVue } from '../../utils/vue/vue';
import { SELECT_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import { MSelectItem } from './select-item/select-item';
import WithRender from './select.html?style=./select.scss';

const DROPDOWN_STYLE_TRANSITION: string = 'max-height 0.3s ease';
@WithRender
@Component({
    components: {
        MSelectItem
    },
    mixins: [
        InputState,
        MediaQueries,
        InputManagement,
        InputWidth,
        InputLabel
    ]
})
export class MSelect extends ModulVue {

    @Model('input')
    @Prop()
    public value: any;

    @Prop()
    public options: any[];

    public $refs: {
        items: HTMLUListElement;
    };

    internalOpen: boolean = false;
    id: string = `${SELECT_NAME}-${uuid.generate()}`;
    focusedIndex: number = -1;

    @Emit('open')
    private async onOpen(): Promise<void> {
        await this.$nextTick();
        this.focusSelected();
        this.scrollToFocused();

    }

    @Emit('close')
    private onClose(): void { }

    get ariaControls(): string {
        return this.id + '-controls';
    }

    get hasItems(): boolean {
        return this.options && this.options.length > 0;
    }

    get isEmpty(): boolean {
        return this.as<InputManagement>().hasValue || (this.open) ? false : true;
    }

    get open(): boolean {
        return this.internalOpen;
    }

    set open(open: boolean) {
        if (this.as<InputState>().active) {
            this.internalOpen = open;
        }
    }

    select(option: any, index: number): void {
        this.as<InputManagement>().model = this.options[index];
        this.open = false;
    }

    isSelected(option: any): boolean {
        return this.as<InputManagement>().internalValue.indexOf(option) > -1;
    }

    onKeydownUp($event: KeyboardEvent): void {
        if (!this.open) {
            this.open = true;
        } else {
            this.focusPreviousItem();
        }
    }

    onKeydownDown($event: KeyboardEvent): void {
        if (!this.open) {
            this.open = true;
        } else {
            this.focusNextItem();
        }
    }

    onKeydownTab($event: KeyboardEvent): void {
        if (this.as<MediaQueries>().isMqMinS) {

            this.open = false;
        }
    }

    onKeydownEsc($event: KeyboardEvent): void {
        if (this.as<MediaQueries>().isMqMinS) {

            this.open = false;
        }
    }

    onKeydownEnter($event: KeyboardEvent): void {
        if (!this.open) {
            this.open = true;
        }
        if (this.focusedIndex > -1) {
            this.select(this.options[this.focusedIndex], this.focusedIndex);
        }
    }

    transitionEnter(el: HTMLElement, done: any): void {
        this.$nextTick(() => {

            if (this.as<MediaQueriesMixin>().isMqMinS) {
                let height: number = el.clientHeight;

                el.style.transition = DROPDOWN_STYLE_TRANSITION;
                el.style.overflowY = 'hidden';
                el.style.maxHeight = '0';

                requestAnimationFrame(() => {
                    el.style.maxHeight = height + 'px';
                    done();
                });
            } else {
                done();
            }

        });
    }

    transitionLeave(el: HTMLElement, done: any): void {
        this.$nextTick(() => {
            if (this.as<MediaQueriesMixin>().isMqMinS) {
                let height: number = el.clientHeight;

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

    private focusSelected(): void {
        this.focusedIndex = this.options.indexOf(this.as<InputManagement>().internalValue);
    }

    private scrollToFocused(): void {
        if (this.focusedIndex > -1 && this.as<MediaQueriesMixin>().isMqMinS) {

            let container: HTMLElement = this.$refs.items;
            if (container) {
                let element: HTMLElement = container.children[this.focusedIndex] as HTMLElement;

                if (element) {
                    let top: number = element.offsetTop;
                    let bottom: number = element.offsetTop + element.offsetHeight;
                    let viewRectTop: number = container.scrollTop;
                    let viewRectBottom: number = viewRectTop + container.clientHeight;
                    if (top < viewRectTop) {
                        container.scrollTop = top;
                    } else if (bottom > viewRectBottom) {
                        container.scrollTop = bottom - container.clientHeight;
                    }
                }
            }

        }
    }

    private focusNextItem(): void {
        if (this.focusedIndex > -1) {
            this.focusedIndex++;
            if (this.focusedIndex >= this.options.length) {
                this.focusedIndex = 0;
            }
        } else {
            this.focusedIndex = this.options.length === 0 ? -1 : 0;
        }
        this.scrollToFocused();
    }

    private focusPreviousItem(): void {
        if (this.focusedIndex > -1) {
            this.focusedIndex--;
            if (this.focusedIndex < 0) {
                this.focusedIndex = this.options.length - 1;
            }
        } else {
            this.focusedIndex = this.options.length - 1;
        }
        this.scrollToFocused();
    }

}

const SelectPlugin: PluginObject<any> = {
    install(v, options): void {
        Vue.use(I18nPlugin);
        v.component(SELECT_NAME, MSelect);
    }
};

export default SelectPlugin;
