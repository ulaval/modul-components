import Vue from 'vue';
import Component from 'vue-class-component';

const ACCORDION_STYLE_TRANSITION: string = 'max-height 0.3s ease';

export interface TransitionAccordionMixin {
    isAnimActive: boolean;
}

@Component
export class TransitionAccordion extends Vue implements TransitionAccordionMixin {
    public isAnimActive: boolean;

    private setTransitionStart(el: HTMLElement) {
        el.style.webkitTransition = ACCORDION_STYLE_TRANSITION;
        el.style.transition = ACCORDION_STYLE_TRANSITION;
        el.style.height = 'auto';
        el.style.overflow = 'hidden';
    }

    private transitionEnter(el: HTMLElement, done): void {
        if (this.isAnimActive || this.isAnimActive == undefined) {
            let height: number = el.clientHeight;
            this.setTransitionStart(el);
            el.style.maxHeight = '0';
            setTimeout(() => {
                el.style.maxHeight = height + 'px';
                done();
            });
        } else {
            done();
        }
    }

    private transitionAfterEnter(el: HTMLElement): void {
        if (this.isAnimActive || this.isAnimActive == undefined) {
            setTimeout(() => {
                el.style.removeProperty('max-height');
                el.style.removeProperty('overflow');
            }, 300);
        }
    }

    private transitionLeave(el: HTMLElement, done): void {
        if (this.isAnimActive || this.isAnimActive == undefined) {
            this.setTransitionStart(el);
            let height: number = el.clientHeight;
            el.style.maxHeight = height + 'px';
            setTimeout(() => {
                el.style.maxHeight = '0';
                setTimeout(() => {
                    done();
                }, 300);
            }, 10);
        } else {
            done();
        }
    }
}
