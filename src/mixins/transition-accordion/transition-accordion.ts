import Vue from 'vue';
import Component from 'vue-class-component';

const ACCORDION_STYLE_TRANSITION: string = 'max-height 0.3s ease';

export interface TransitionAccordionMixin {
    accordionAnim: boolean;
}

@Component
export class TransitionAccordion extends Vue implements TransitionAccordionMixin {
    public accordionAnim: boolean;

    private setTransitionStart(el: HTMLElement) {
        el.style.webkitTransition = ACCORDION_STYLE_TRANSITION;
        el.style.transition = ACCORDION_STYLE_TRANSITION;
        el.style.height = 'auto';
        el.style.overflow = 'hidden';
    }

    private accordionEnter(el: HTMLElement, done): void {
        if (this.accordionAnim || this.accordionAnim == undefined) {
            this.$nextTick(() => {
                let height: number = el.clientHeight;
                this.setTransitionStart(el);
                el.style.maxHeight = '0';
                setTimeout(() => {
                    el.style.maxHeight = height + 'px';
                    done();
                });
            });
        } else {
            done();
        }
    }

    private accordionAfterEnter(el: HTMLElement): void {
        if (this.accordionAnim || this.accordionAnim == undefined) {
            setTimeout(() => {
                el.style.removeProperty('max-height');
                el.style.removeProperty('overflow');
            }, 300);
        }
    }

    private accordionLeave(el: HTMLElement, done): void {
        if (this.accordionAnim || this.accordionAnim == undefined) {
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
