import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import uuid from '../../utils/uuid/uuid';
import { InputState, InputStateMixin } from '../../mixins/input-state/input-state';
import { MediaQueries } from '../../mixins/media-queries/media-queries';

export interface DropdownTemplateMixin {
    mode: string;
    label: string;
    editable: boolean;
    defaultText: string;
    defaultFirstElement: boolean;
}

const DROPDOWN_MAX_HEIGHT: number = 198;
const POPPER_CLASS_NAME: string = '.m-popper__popper';

@Component({
    mixins: [
        InputState,
        MediaQueries
    ]
})
export class DropdownTemplate extends ModulVue implements DropdownTemplateMixin, InputStateMixin {

    @Prop()
    public label: string;
    @Prop({ default: false })
    public editable: boolean;
    @Prop()
    public defaultText: string;
    @Prop({ default: false })
    public defaultFirstElement: boolean;

    public mode: string;

    /// var from InputStateMixin
    public isDisabled: boolean;
    public hasError: boolean;
    public isValid: boolean;

    // var from MediaQueries
    public isScreenMaxS: boolean;

    public get hasLabel(): boolean {
        return this.label == '' || this.label == undefined ? false : true;
    }

    public focusOnResearchInput(): void {
        this.$refs.researchInput['focus']();
    }

    public get researchText(): string {
        return this.$i18n.translate('m-dropdown:research');
    }

    public animEnter(element: HTMLElement, done: any): void {
        let el: HTMLElement = element.querySelector(POPPER_CLASS_NAME) as HTMLElement;
        let height: number = el.clientHeight > DROPDOWN_MAX_HEIGHT ? DROPDOWN_MAX_HEIGHT : el.clientHeight;
        let transition: string = '0.3s max-height ease';
        el.style.transition = transition;
        el.style.webkitTransition = transition;
        el.style.overflowY = 'hidden';
        el.style.maxHeight = '0';
        setTimeout(() => {
            el.style.maxHeight = height + 'px';
            done();
        }, 0);
    }

    public animAfterEnter(element: HTMLElement): void {
        let el: HTMLElement = element.querySelector(POPPER_CLASS_NAME) as HTMLElement;
        setTimeout(() => {
            el.style.maxHeight = DROPDOWN_MAX_HEIGHT + 'px';
            el.style.overflowY = 'auto';
        }, 300);
    }

    public animLeave(element: HTMLElement, done: any): void {
        let el: HTMLElement = element.querySelector(POPPER_CLASS_NAME) as HTMLElement;
        let height: number = el.clientHeight;
        el.style.maxHeight = height + 'px';
        el.style.overflowY = 'hidden';
        el.style.maxHeight = '0';
        setTimeout(() => {
            el.style.maxHeight = 'none';
            done();
        }, 300);
    }
}
