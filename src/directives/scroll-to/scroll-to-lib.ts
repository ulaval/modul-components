export enum ScrollToDuration {
    Null = 'null',
    Slow = 'slow',
    Slower = 'slower',
    Regular = 'regular',
    Fast = 'fast'
}

export interface CancelableScrollTo { promise: Promise<any>; cancel: () => void; }

/**
 * @deprecated use global service in /utils/scroll-to.
 */
export class ScrollTo {
    // https://coderwall.com/p/hujlhg/smooth-scrolling-without-jquery
    public scrollToTop(element: HTMLElement, duration: string = ScrollToDuration.Regular): CancelableScrollTo {
        return this.intertnalStartScroll(element, 0, duration);
    }

    public scrollToBottom(element: HTMLElement, duration: string = ScrollToDuration.Regular): CancelableScrollTo {
        return this.intertnalStartScroll(element, element.offsetHeight, duration);
    }

    public startScroll(
        element: HTMLElement = document.body,
        target: number = 0,
        duration: string = ScrollToDuration.Regular
    ): Promise<any> {
        return this.intertnalStartScroll(element, target, duration).promise;
    }

    private intertnalStartScroll(
        element: HTMLElement = document.body,
        target: number = 0,
        duration: string = ScrollToDuration.Regular
    ): CancelableScrollTo {
        target = Math.round(target);
        let time: number;
        let cancelled: boolean = false;
        const cancel: () => void = () => {
            cancelled = true;
            if (currentFrame) {
                cancelAnimationFrame(currentFrame);
                currentFrame = undefined;
            }
        };
        let currentFrame: number | undefined;

        switch (duration) {
            case ScrollToDuration.Null:
                time = 0;
                break;
            case ScrollToDuration.Slow:
                time = 1500;
                break;
            case ScrollToDuration.Slower:
                time = 3000;
                break;
            case ScrollToDuration.Fast:
                time = 400;
                break;
            default:
                time = 800;
        }

        if (time < 0) {
            return { promise: Promise.reject('bad duration'), cancel: () => cancel() };
        }

        if (time === 0) {
            element.scrollTop = target;
            return { promise: Promise.resolve(), cancel: () => cancel() };
        }

        let startTime: number = Date.now();
        let endTime: number = startTime + time;

        let startTop: number = window.pageYOffset;
        let distance: number = target - startTop;

        // based on http://en.wikipedia.org/wiki/Smoothstep
        let smoothStep: (start, end, point) => number = (start, end, point) => {
            if (point <= start) {
                return 0;
            }
            if (point >= end) {
                return 1;
            }
            let x: number = (point - start) / (end - start); // interpolation
            return x * x * (3 - 2 * x);
        };

        return {
            promise: new Promise((resolve, reject) => {
                // This is to keep track of where the element's scrollTop is
                // supposed to be, based on what we're doing
                let previousTop: number = window.pageYOffset;

                // This is like a think function from a game loop
                let scrollFrame: () => void = () => {
                    if (window.pageYOffset !== previousTop || cancelled) {
                        resolve();
                        return;
                    }

                    // set the scrollTop for this frame
                    let now: number = Date.now();
                    let point: number = smoothStep(startTime, endTime, now);
                    let frameTop: number = Math.round(startTop + distance * point);
                    window.scrollTo(0, frameTop);

                    // check if we're done!
                    if (now >= endTime) {
                        resolve();
                        return;
                    }

                    // If we were supposed to scroll but didn't, then we
                    // probably hit the limit, so consider it done; not
                    // interrupted.
                    if (
                        window.pageYOffset === previousTop &&
                        window.pageYOffset !== frameTop
                    ) {
                        resolve();
                        return;
                    }
                    previousTop = window.pageYOffset;

                    // schedule next frame for execution
                    currentFrame = requestAnimationFrame(scrollFrame);
                };

                // boostrap the animation process
                currentFrame = requestAnimationFrame(scrollFrame);
            }), cancel: () => cancel()
        };
    }
}


// tslint:disable-next-line: deprecation
const ScrollToLib: ScrollTo = new ScrollTo();

export default ScrollToLib;
