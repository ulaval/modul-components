import { PluginObject } from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        $scrollTo: ScrollTo;
    }
}

export enum ScrollToDuration {
    Long = 'long',
    Regular = 'regular',
    Fast = 'fast',
    Instant = 'instant'
}

// linear
type EasingFunction = (t: number) => number;
const linear: EasingFunction = t => t;
// accelerating from zero velocity
const easeInQuad: EasingFunction = t => t * t;
// decelerating to zero velocity
const easeOutQuad: EasingFunction = t => t * (2 - t);
// accelerating from zero velocity
const easeInCubic: EasingFunction = t => t * t * t;
// decelerating to zero velocity
const easeOutCubic: EasingFunction = t => --t * t * t + 1;
// accelerating from zero velocity
const easeInQuint: EasingFunction = t => t * t * t * t * t;
// decelerating to zero velocity
const easeOutQuint: EasingFunction = t => 1 + --t * t * t * t * t;

const defaultEasingFunction: EasingFunction = easeOutQuint;

export class ScrollTo {

    /**
     * Scroll to top of the current windows
     *
     * @param duration duration of the scroll
     */
    public goToTop(duration: ScrollToDuration = ScrollToDuration.Regular): Promise<any> {

        return this.internalScroll(undefined, 0, duration, defaultEasingFunction);
    }

    /**
     * Scroll to top of an specified container
     *
     * @param container the HTML container containing the scroll
     * @param duration duration of the scroll
     */
    public goToTopInside(container: HTMLElement, duration: ScrollToDuration = ScrollToDuration.Regular): Promise<any> {

        return this.internalScroll(container, 0, duration, defaultEasingFunction);
    }

    /**
     * Scroll to the bottom of an specified container
     *
     * @param container the HTML container containing the scroll
     * @param duration duration of the scroll
     */
    public goToBottomInside(container: HTMLElement, duration: ScrollToDuration = ScrollToDuration.Regular): Promise<any> {

        const targetLocation: number = this.maxContainerScroll(container);

        return this.internalScroll(container, targetLocation, duration, defaultEasingFunction);
    }

    /**
     * Scroll to the bottom of the windows
     *
     * @param duration duration of the scroll
     */
    public goToBottom(duration: ScrollToDuration = ScrollToDuration.Regular): Promise<any> {

        const targetLocation: number = this.maxWindowScroll();

        return this.internalScroll(undefined, targetLocation, duration, defaultEasingFunction);
    }

    /**
     * Scroll to a specific element or position of the windows
     *
     * @param target the HTML container containing the scroll
     * @param offset the offset to add (in case of a sticky header)
     * @param duration duration of the scroll
     */
    public goTo(target: HTMLElement | number, offset: number, duration: ScrollToDuration = ScrollToDuration.Regular): Promise<any> {

        let targetLocation: number = 0;

        // get element relative position from window
        if (target instanceof HTMLElement) {
            const elementLocation: number = target.getBoundingClientRect().top + window.pageYOffset;
            targetLocation = Math.max(Math.round(elementLocation) + offset, 0);
        } else {
            targetLocation = +target;
        }

        // get scroll location if its less than maxscroll
        const scrollLocation: number = Math.min(targetLocation, this.maxWindowScroll());
        return this.internalScroll(undefined, scrollLocation, duration, defaultEasingFunction);
    }

    /**
     * Scroll to a specific element of an specified container
     *
     * @param container the HTML container containing the scroll
     * @param target the target HtmlElement
     * @param offset the offset to add (in case of a sticky header)
     * @param duration duration of the scroll
     * @param easing easing function to use
     */
    public goToInside(container: HTMLElement, target: HTMLElement | number, offset: number, duration: ScrollToDuration = ScrollToDuration.Regular): Promise<any> {

        let targetLocation: number = 0;

        // get element relative position from container
        if (target instanceof HTMLElement) {
            const scrollTop: number = (container.getBoundingClientRect().top * -1) + container.scrollTop;
            targetLocation = (target.getBoundingClientRect().top + scrollTop) - container.clientTop;
            targetLocation = targetLocation + offset;

        } else {
            targetLocation = +target;
        }

        // get scroll location if its less than maxscroll
        const scrollLocation: number = Math.min(targetLocation, this.maxContainerScroll(container));

        return this.internalScroll(container, scrollLocation, duration, defaultEasingFunction);
    }

    private internalScroll(container: HTMLElement | undefined, targetLocation: number, duration: ScrollToDuration, easing: EasingFunction): Promise<number> {
        return new Promise((resolve, reject) => {
            const startTime: number = performance.now();
            let startLocation: number = 0;
            if (container) {
                this.disableScrollEvent(container);
                startLocation = container.scrollTop;
            } else {
                this.disableScrollEvent(document.body);
                startLocation = window.pageYOffset;
            }

            const distanceToScroll: number = targetLocation - startLocation;
            const _duration: number = this.getDuration(duration);

            const step: any = (currentTime: number) => {
                const progressPercentage: number = _duration ? Math.min(1, ((currentTime - startTime) / _duration)) : 100;
                const targetPosition: number = _duration ? Math.floor(startLocation + distanceToScroll * easing(progressPercentage)) : targetLocation;

                if (container) {
                    container.scrollTop = targetPosition;

                    if (targetPosition === targetLocation || progressPercentage === 1) {
                        this.enableScrollEvent(container);
                        return resolve(targetLocation);
                    }

                } else {
                    window.scrollTo(0, targetPosition);

                    if (Math.round(window.pageYOffset) === targetLocation || progressPercentage === 1) {

                        this.enableScrollEvent(document.body);
                        return resolve(targetLocation);
                    }
                }

                window.requestAnimationFrame(step);
            };

            window.requestAnimationFrame(step);
        });
    }

    private disableScrollEvent(container: HTMLElement): void {
        container.addEventListener('touchmove', this.preventDefault, { passive: false });
        container.addEventListener('wheel', this.preventDefault, { passive: false });
        container.addEventListener('touchstart ', this.preventDefault, { passive: false });
    }

    private enableScrollEvent(container: HTMLElement): void {
        container.removeEventListener('touchmove', this.preventDefault);
        container.removeEventListener('wheel', this.preventDefault);
        container.removeEventListener('touchstart', this.preventDefault);
    }

    private preventDefault(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
    }

    private maxContainerScroll(container: HTMLElement): number {
        return Math.max(Math.round(container.scrollHeight - container.offsetHeight), 0);
    }

    private maxWindowScroll(): number {
        return this.getDocumentHeight() - this.getWindowHeight();
    }

    private getDocumentHeight(): number {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement ? document.documentElement.scrollHeight : 0,
            document.body.offsetHeight,
            document.documentElement ? document.documentElement.offsetHeight : 0,
            document.body.clientHeight,
            document.documentElement ? document.documentElement.clientHeight : 0
        );
    }

    private getWindowHeight(): number {
        return window.innerHeight ||
            (document.documentElement || document.body).clientHeight;
    }

    private getDuration(speed: ScrollToDuration): number {
        switch (speed) {
            case ScrollToDuration.Long:
                return 1000;
            case ScrollToDuration.Regular:
                return 600;
            case ScrollToDuration.Fast:
                return 400;
            case ScrollToDuration.Instant:
                return 0;
            default: throw Error('scrollToUtil: Unknown scroll duration.');
        }
    }

}

const ScrollToPlugin: PluginObject<any> = {
    install(v): void {
        let scrollTo: ScrollTo = new ScrollTo();
        (v.prototype).$scrollTo = scrollTo;
    }
};

export default ScrollToPlugin;
