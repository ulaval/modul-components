import { PluginObject } from 'vue';

export enum ScrollToDuration {
    Regular = 'regular',
    Long = 'long'
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

        const targetLocation: number = Math.max(Math.round(container.scrollHeight), 0);

        return this.internalScroll(container, targetLocation, duration, defaultEasingFunction);
    }

    /**
     * Scroll to the bottom of the windows
     *
     * @param duration duration of the scroll
     */
    public goToBottom(duration: ScrollToDuration = ScrollToDuration.Regular): Promise<any> {

        const targetLocation: number = document.body.offsetHeight;

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

        return this.internalScroll(undefined, targetLocation, duration, defaultEasingFunction);
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
            const containerPosition: number = Math.round(container.offsetTop);
            const elementPosition: number = Math.round(target.offsetTop);
            targetLocation = Math.max((elementPosition - containerPosition) + offset, 0);
        } else {
            targetLocation = +target;
        }

        return this.internalScroll(container, targetLocation, duration, defaultEasingFunction);
    }

    private internalScroll(container: HTMLElement | undefined, targetLocation: number, duration: ScrollToDuration, easing: EasingFunction): Promise<number> {
        return new Promise((resolve, reject) => {
            const startTime: number = performance.now();
            let startLocation: number = 0;
            if (container) {
                startLocation = container.scrollTop;
            } else {
                startLocation = window.pageYOffset;
            }

            const distanceToScroll: number = targetLocation - startLocation;
            const _duration: number = this.getDuration(duration);

            const step: any = (currentTime) => {
                const progressPercentage: number = Math.min(1, ((currentTime - startTime) / _duration));
                const targetPosition: number = Math.floor(startLocation + distanceToScroll * easing(progressPercentage));

                if (container) {
                    container.scrollTop = targetPosition;

                    if (targetPosition === targetLocation || progressPercentage === 1) {
                        return resolve(targetLocation);
                    }

                } else {
                    window.scrollTo(0, targetPosition);

                    if (Math.round(window.pageYOffset) === targetLocation || progressPercentage === 1) {
                        return resolve(targetLocation);
                    }
                }

                window.requestAnimationFrame(step);
            };

            window.requestAnimationFrame(step);
        });
    }

    private getDuration(speed: ScrollToDuration): number {
        switch (speed) {
            case ScrollToDuration.Long:
                return 1000;
            default:
                return 600;
        }
    }

}

const ScrollToPlugin: PluginObject<any> = {
    install(v): void {
        let scrollTo: ScrollTo = new ScrollTo();
        (v.prototype as any).$scrollTo = scrollTo;
    }
};

export default ScrollToPlugin;
