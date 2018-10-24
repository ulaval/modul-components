import { PluginObject } from 'vue';

export enum ScrollToDuration {
    Slow = 'slow',
    Slower = 'slower',
    Regular = 'regular',
    Fast = 'fast'
}

export enum ScrollToEasing {
    Linear = 'linear',
    EaseInQuad = 'easeInQuad',
    EaseOutQuad = 'easeOutQuad',
    EaseInCubic = 'easeInCubic',
    EaseOutCubic = 'easeOutCubic'
}

// tslint:disable:typedef
// linear
const linear = t => t;
// accelerating from zero velocity
const easeInQuad = t => t * t;
// decelerating to zero velocity
const easeOutQuad = t => t * (2 - t);
// accelerating from zero velocity
const easeInCubic = t => t * t * t;
// decelerating to zero velocity
const easeOutCubic = t => --t * t * t + 1;
// tslint:enable:typedef

/**
 *
 */
export class ScrollTo {

    /**
     * Scroll to top of the current windows
     *
     * @param offset the offset to add (in case of a sticky header)
     * @param duration duration of the scroll
     * @param easing easing function to use
     */
    public goToTop(offset: number, duration: ScrollToDuration = ScrollToDuration.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        let targetLocation: number = 0 + offset;

        return this.internalScroll(undefined, targetLocation, duration, easing);
    }

    /**
     * Scroll to top of an specified container
     *
     * @param container the HTML container containing the scroll
     * @param offset the offset to add (in case of a sticky header)
     * @param duration duration of the scroll
     * @param easing easing function to use
     */
    public goToTopInside(container: HTMLElement, offset: number, duration: ScrollToDuration = ScrollToDuration.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        const containerPosition: number = Math.round(container.offsetTop) + offset;
        const elementPosition: number = 0;
        const targetLocation: number = (elementPosition - containerPosition);

        return this.internalScroll(container, 0, duration, easing);
    }

    /**
     * Scroll to the bottom of an specified container
     *
     * @param container the HTML container containing the scroll
     * @param offset the offset to add (in case of a sticky header)
     * @param duration duration of the scroll
     * @param easing easing function to use
     */
    public goToBottomInside(container: HTMLElement, offset: number, duration: ScrollToDuration = ScrollToDuration.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        const targetLocation: number = Math.max(Math.round(container.scrollHeight) + offset, 0);

        return this.internalScroll(container, targetLocation, duration, easing);
    }

    /**
     * Scroll to the bottom of the windows
     *
     * @param offset the offset to add (in case of a sticky header)
     * @param duration duration of the scroll
     * @param easing easing function to use
     */
    public goToBottom(offset: number, duration: ScrollToDuration = ScrollToDuration.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        let targetLocation: number = document.body.offsetHeight + offset;

        return this.internalScroll(undefined, targetLocation, duration, easing);
    }

    /**
     * Scroll to a specific element or position of the windows
     *
     * @param target the HTML container containing the scroll
     * @param offset the offset to add (in case of a sticky header)
     * @param duration duration of the scroll
     * @param easing easing function to use
     */
    public goTo(target: HTMLElement | number, offset: number, duration: ScrollToDuration = ScrollToDuration.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        let targetLocation: number = 0;

        // get element relative position from window
        if (target instanceof HTMLElement) {
            const elementLocation: number = target.getBoundingClientRect().top + window.pageYOffset;
            targetLocation = Math.max(Math.round(elementLocation) + offset, 0);
        } else {
            targetLocation = +target;
        }

        return this.internalScroll(undefined, targetLocation, duration, easing);
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
    public goToInside(container: HTMLElement, target: HTMLElement | number, offset: number, duration: ScrollToDuration = ScrollToDuration.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        let targetLocation: number = 0;

        // get element relative position from container
        if (target instanceof HTMLElement) {
            const containerPosition: number = Math.round(container.offsetTop);
            const elementPosition: number = Math.round(target.offsetTop);
            targetLocation = Math.max((elementPosition - containerPosition) + offset, 0);
        } else {
            targetLocation = +target;
        }

        return this.internalScroll(container, targetLocation, duration, easing);
    }

    private internalScroll(container: HTMLElement | undefined, targetLocation: number, duration: ScrollToDuration, easing: ScrollToEasing): Promise<number> {
        return new Promise((resolve, reject) => {
            const startTime: number = performance.now();
            let startLocation: number = 0;
            if (container) {
                startLocation = container.scrollTop;
            } else {
                startLocation = window.pageYOffset;
            }

            const distanceToScroll: number = targetLocation - startLocation;
            const easingFunction: (t: any) => any = this.getEasingFunction(easing);
            const _duration: number = this.getDuration(duration);

            const step: any = (currentTime) => {
                const progressPercentage: number = Math.min(1, ((currentTime - startTime) / _duration));
                const targetPosition: number = Math.floor(startLocation + distanceToScroll * easingFunction(progressPercentage));

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

    private getEasingFunction(easing: ScrollToEasing): (t: any) => any {
        switch (easing) {
            case ScrollToEasing.EaseInQuad:
                return easeInQuad;
            case ScrollToEasing.EaseOutQuad:
                return easeOutQuad;
            case ScrollToEasing.EaseInCubic:
                return easeInCubic;
            case ScrollToEasing.EaseOutCubic:
                return easeOutCubic;
            default:
                return linear;
        }
    }

    private getDuration(speed: ScrollToDuration): number {
        switch (speed) {
            case ScrollToDuration.Slow:
                return 1500;
            case ScrollToDuration.Slower:
                return 3000;
            case ScrollToDuration.Fast:
                return 400;
            default:
                return 800;
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
