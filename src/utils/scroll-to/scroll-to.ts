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
    public goToTop(speed: ScrollToSpeed, easing: ScrollToEasing): Promise<any> {
        const targetLocation: number = 0;
        return this.internalScrollTo(targetLocation, speed, easing);
    }

    /**
     * Scroll to the bottom of the page.
     *
     * @param offset
     * @param speed
     * @param easing
     */
    public goToBottom(speed: ScrollToSpeed, easing: ScrollToEasing): Promise<any> {
        // const targetLocation: number = (window.innerHeight ||
        //     (document.documentElement || document.body).clientHeight) + offset;

        const targetLocation: number = document.body.offsetHeight ;

        return this.internalScrollTo(targetLocation, speed, easing);
    }

    /**
     * Scroll to a specified html element.
     *
     * @param offset
     * @param speed
     * @param easing
     */
    public goTo(element: Element, offset: number, speed: ScrollToSpeed, easing: ScrollToEasing): Promise<any> {

        const elementLocation: number = element.getBoundingClientRect().top + window.pageYOffset;
        const targetLocation: number = Math.max(Math.round(elementLocation) + offset, 0);

        return this.internalScrollTo(targetLocation, speed, easing);
    }

    private internalScrollTo(targetLocation: number, speed: ScrollToSpeed, easing: ScrollToEasing): Promise<number> {
        return new Promise((resolve, reject) => {
            const startTime: number = performance.now();
            const startLocation: number = window.pageYOffset;
            const distanceToScroll: number = targetLocation - startLocation;
            const easingFunction: (t: any) => any = this.getEasingFunction(easing);
            const duration: number = this.getDuration(speed);

            const step: any = (currentTime) => {
                const progressPercentage: number = Math.min(1, ((currentTime - startTime) / duration));
                const targetPosition: number = Math.floor(startLocation + distanceToScroll * easingFunction(progressPercentage));

                window.scrollTo(0, targetPosition);

                if (Math.round(window.pageYOffset) === targetLocation || progressPercentage === 1) {
                    return resolve(targetLocation);
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
