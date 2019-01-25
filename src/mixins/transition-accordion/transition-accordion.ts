import Vue from 'vue';
import Component from 'vue-class-component';

const ACCORDION_STYLE_TRANSITION: string = 'max-height 0.3s ease';

export interface TransitionAccordionMixin {
    accordionAnim: boolean;
}

@Component
export class TransitionAccordion extends Vue implements TransitionAccordionMixin {
    public accordionAnim: boolean;

    private setTransitionStart(el: HTMLElement): void {

        // tslint:disable-next-line: deprecation
        el.style.webkitTransition = ACCORDION_STYLE_TRANSITION;
        el.style.transition = ACCORDION_STYLE_TRANSITION;
        el.style.height = 'auto';
        el.style.overflow = 'hidden';
    }

    private accordionEnter(el: HTMLElement, done): void {
        this.$nextTick(() => {
            if (this.accordionAnim || this.accordionAnim === undefined) {
                let height: number = el.clientHeight;
                el.style.maxHeight = '0';
                this.setTransitionStart(el);
                setTimeout(() => {
                    el.style.maxHeight = height + 'px';
                    done();
                }, 50);
            } else {
                done();
            }
        });
    }

    private accordionAfterEnter(el: HTMLElement): void {
        if (this.accordionAnim || this.accordionAnim === undefined) {
            setTimeout(() => {
                el.style.removeProperty('max-height');
                el.style.removeProperty('overflow');
            }, 300);
        }
    }

    private accordionLeave(el: HTMLElement, done): void {
        this.$nextTick(() => {
            if (this.accordionAnim || this.accordionAnim === undefined) {
                let height: number = el.clientHeight;
                el.style.maxHeight = height + 'px';
                this.setTransitionStart(el);
                setTimeout(() => {
                    el.style.maxHeight = '0';
                    setTimeout(() => {
                        done();
                    }, 300);
                }, 50);
            } else {
                done();
            }
        });
    }
}
