import { SCROLL_TO_NAME } from '../directive-names';

export enum ScrollToDuration {
    Null = 'null',
    Slow = 'slow',
    Regular = 'regular',
    Fast = 'fast'
}

export class ScrollTo {

    // https://coderwall.com/p/hujlhg/smooth-scrolling-without-jquery
    public startScroll(element: HTMLElement = document.body, target: number = 0, duration: string = ScrollToDuration.Regular) {
        target = Math.round(target);
        let time: number;

        switch (duration) {
            case ScrollToDuration.Null:
                time = 0;
                break;
            case ScrollToDuration.Slow:
                time = 1500;
                break;
            case ScrollToDuration.Fast:
                time = 400;
                break;
            default:
                time = 800;
        }

        if (time < 0) {
            return Promise.reject('bad duration');
        }

        if (time === 0) {
            element.scrollTop = target;
            return Promise.resolve();
        }

        let startTime = Date.now();
        let endTime = startTime + time;

        let startTop = window.pageYOffset;
        let distance = target - startTop;

        // based on http://en.wikipedia.org/wiki/Smoothstep
        let smoothStep = (start, end, point) => {
            if (point <= start) { return 0; }
            if (point >= end) { return 1; }
            let x = (point - start) / (end - start); // interpolation
            return x * x * (3 - 2 * x);
        };

        return new Promise((resolve, reject) => {
            // This is to keep track of where the element's scrollTop is
            // supposed to be, based on what we're doing
            let previousTop = window.pageYOffset;

            // This is like a think function from a game loop
            let scrollFrame = () => {
                if (window.pageYOffset != previousTop) {
                    resolve();
                    return;
                }

                // set the scrollTop for this frame
                let now = Date.now();
                let point = smoothStep(startTime, endTime, now);
                let frameTop = Math.round(startTop + (distance * point));
                window.scrollTo(0, frameTop);

                // check if we're done!
                if (now >= endTime) {
                    resolve();
                    return;
                }

                // If we were supposed to scroll but didn't, then we
                // probably hit the limit, so consider it done; not
                // interrupted.
                if (window.pageYOffset === previousTop
                    && window.pageYOffset !== frameTop) {
                    resolve();
                    return;
                }
                previousTop = window.pageYOffset;

                // schedule next frame for execution
                setTimeout(scrollFrame, 0);
            };

            // boostrap the animation process
            setTimeout(scrollFrame, 0);
        });
    }
}

const ScrollToLib = new ScrollTo();

export default ScrollToLib;
