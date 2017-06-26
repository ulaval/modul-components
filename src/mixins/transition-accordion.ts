import Vue from 'vue';
import Component from 'vue-class-component';

export interface TransitionAccordionMixin {
    animIsActive: boolean;
}

@Component
export class TransitionAccordion extends Vue implements TransitionAccordionMixin {
    public animIsActive: boolean;

    private animEnter(el: HTMLElement, done): void {
        if (this.animIsActive) {
            let height: number = el.clientHeight;
            el.style.maxHeight = '0';
            setTimeout(() => {
                el.style.maxHeight = height + 'px';
                done();
            }, 0);
        } else {
            done();
        }
    }

    private animAfterEnter(el: HTMLElement): void {
        if (this.animIsActive) {
            setTimeout(() => {
                el.style.maxHeight = 'none';
            }, 300);
        }
    }

    private animLeave(el: HTMLElement, done): void {
        if (this.animIsActive) {
            let height: number = el.clientHeight;
            el.style.maxHeight = height + 'px';
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
