import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { ModulVue } from '../../../utils/vue/vue';
import { ACCORDION_TRANSITION_NAME } from '../../component-names';
import WithRender from './accordion-transition.html';
import './accordion-transition.scss';

const CLASS_HAS_TRANSITION: string = 'm--has-transition';

@WithRender
@Component
export class MAccordionTransition extends ModulVue {
    @Prop()
    public heightDelta: number;

    @Prop({ default: true })
    public disabled: boolean;

    public setClassHasTransition(el: HTMLElement): void {
        if (!el.classList.contains(ACCORDION_TRANSITION_NAME)) {
            el.classList.add(ACCORDION_TRANSITION_NAME);
        }

        if (!this.disabled) {
            el.classList.add(CLASS_HAS_TRANSITION);
        } else if (el.classList.contains(CLASS_HAS_TRANSITION)) {
            el.classList.remove(CLASS_HAS_TRANSITION);
        }
    }

    @Emit('before-enter')
    public beforeEnter(el: HTMLElement): void {
        this.setClassHasTransition(el);
    }

    @Emit('enter')
    public enter(el: HTMLElement): void {
        const heightDelta: number = this.heightDelta || 0;
        el.style.height = `${el.scrollHeight - heightDelta}px`;
    }

    @Emit('after-enter')
    public afterEnter(el: HTMLElement): void {
        el.style.removeProperty('height');
    }

    @Emit('before-leave')
    public beforeLeave(el: HTMLElement): void {
        el.style.height = parseInt((window.getComputedStyle(el).height as string), 10) + 'px';
        this.setClassHasTransition(el);
    }

    @Emit('leave')
    public leave(el: HTMLElement): void {
    }

    @Emit('after-leave')
    public afterLeave(el: HTMLElement): void {
        el.style.removeProperty('height');
    }
}

const AccordionTransitionPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(ACCORDION_TRANSITION_NAME, MAccordionTransition);
    }
};

export default AccordionTransitionPlugin;
