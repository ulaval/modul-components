
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ScrollToDuration } from '../../utils/scroll-to/scroll-to';
import { ModulVue } from '../../utils/vue/vue';
import { SLIDE_TRANSITION_NAME } from '../component-names';
import WithRender from './slide-transition.html?style=./slide-transition.scss';

@WithRender
@Component
export class MSlideTransition extends ModulVue {

    @Prop({ default: true })
    public leftToRight: boolean;

    @Prop({ default: 0 })
    public scrollToOffset: number; // the offset to add (in case of a sticky header)

    @Prop({ default: false })
    public disabled: boolean;

    public get name(): string {
        return this.disabled ? 'm--is-disabled' : 'm--is';
    }

    private transitionEnter(el: HTMLElement): void {
        this.$scrollTo.goTo(this.$el, this.scrollToOffset, ScrollToDuration.Regular);
        setTimeout(() => {
            this.transitionBeforeLeave(el);
        }, 100);
        this.$emit('enter');
    }

    private transitionAfterEnter(): void {
        this.$el.style.removeProperty('height');
    }

    private transitionBeforeLeave(el: HTMLElement): void {
        this.$el.style.height = this.getHauteurEl(el) + 'px';
    }

    private transitionAfterLeave(): void {
        this.transitionAfterEnter();
        this.$emit('afterLeave');
    }

    private getHauteurEl(el): number {
        let elComputedStyle: any = window.getComputedStyle(el);
        return parseInt(elComputedStyle.height as string, 10)
            + parseInt(elComputedStyle.marginTop as string, 10)
            + parseInt(elComputedStyle.marginBottom as string, 10)
            + parseInt(elComputedStyle.paddingTop as string, 10)
            + parseInt(elComputedStyle.paddingBottom as string, 10)
            + parseInt(elComputedStyle.borderTopWidth as string, 10)
            + parseInt(elComputedStyle.borderBottomWidth as string, 10);
    }
}

const SlideTransitionPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(SLIDE_TRANSITION_NAME, MSlideTransition);
    }
};

export default SlideTransitionPlugin;
