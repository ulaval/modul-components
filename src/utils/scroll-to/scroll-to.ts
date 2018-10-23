import { PluginObject } from 'vue';

export enum ScrollToSpeed {
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
     * Scroll to the top of the page.
     *
     * @param offset
     * @param speed
     * @param easing
     */
    public goToTop(offset: number, speed: ScrollToSpeed = ScrollToSpeed.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        let targetLocation: number = 0 + offset;

        return this.internalScroll(undefined, targetLocation, speed, easing);
    }

    public goToTopInside(container: HTMLElement, offset: number, speed: ScrollToSpeed = ScrollToSpeed.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        const containerPosition: number = Math.round(container.offsetTop) + offset;
        const elementPosition: number = 0;
        const targetLocation: number = (elementPosition - containerPosition);

        return this.internalScroll(container, 0, speed, easing);
    }

    public goToBottomInside(container: HTMLElement, offset: number, speed: ScrollToSpeed = ScrollToSpeed.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        const targetLocation: number = Math.max(Math.round(container.scrollHeight) + offset, 0);

        return this.internalScroll(container, targetLocation, speed, easing);
    }

    public goToBottom(offset: number, speed: ScrollToSpeed = ScrollToSpeed.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        let targetLocation: number = document.body.offsetHeight + offset;

        return this.internalScroll(undefined, targetLocation, speed, easing);
    }

    public goTo(target: HTMLElement | number, offset: number, speed: ScrollToSpeed = ScrollToSpeed.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        let targetLocation: number = 0;

        // get element relative position from window
        if (target instanceof HTMLElement) {
            const elementLocation: number = target.getBoundingClientRect().top + window.pageYOffset;
            targetLocation = Math.max(Math.round(elementLocation) + offset, 0);
        } else {
            targetLocation = +target;
        }

        return this.internalScroll(undefined, targetLocation, speed, easing);
    }

    public goToInside(container: HTMLElement, target: HTMLElement, offset: number, speed: ScrollToSpeed = ScrollToSpeed.Regular, easing: ScrollToEasing = ScrollToEasing.Linear): Promise<any> {

        let targetLocation: number = 0;

        // get element relative position from container
        const containerPosition: number = Math.round(container.offsetTop);
        const elementPosition: number = Math.round(target.offsetTop);
        targetLocation = Math.max((elementPosition - containerPosition) + offset, 0);

        return this.internalScroll(container, targetLocation, speed, easing);
    }

    private internalScroll(container: HTMLElement | undefined, targetLocation: number, speed: ScrollToSpeed, easing: ScrollToEasing): Promise<number> {
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
            const duration: number = this.getDuration(speed);

            const step: any = (currentTime) => {
                const progressPercentage: number = Math.min(1, ((currentTime - startTime) / duration));
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

    private getDuration(speed: ScrollToSpeed): number {
        switch (speed) {
            case ScrollToSpeed.Slow:
                return 1500;
            case ScrollToSpeed.Slower:
                return 3000;
            case ScrollToSpeed.Fast:
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
