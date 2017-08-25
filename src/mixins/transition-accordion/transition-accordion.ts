import Vue from 'vue';
import Component from 'vue-class-component';

export interface TransitionAccordionMixin {
    isAnimActive: boolean;
}

@Component
export class TransitionAccordion extends Vue implements TransitionAccordionMixin {
    public isAnimActive: boolean;

    private animEnter(el: HTMLElement, done): void {
        if (this.isAnimActive) {
            let height: number = el.clientHeight;
            el.style.maxHeight = '0';
            el.style.overflow = 'hidden';
            setTimeout(() => {
                el.style.maxHeight = height + 'px';
                done();
            }, 0);
        } else {
            done();
        }
    }

    private animAfterEnter(el: HTMLElement): void {
        if (this.isAnimActive) {
            setTimeout(() => {
                el.style.removeProperty('max-height');
                el.style.removeProperty('overflow');
            }, 300);
        }
    }

    private animLeave(el: HTMLElement, done): void {
        if (this.isAnimActive) {
            let height: number = el.clientHeight;
            el.style.maxHeight = height + 'px';
            el.style.overflow = 'hidden';
            setTimeout(() => {
                el.style.maxHeight = '0';
            }, 0);
            setTimeout(() => {
                done();
            }, 300);
        } else {
            done();
        }
    }
}
