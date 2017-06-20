import Vue, { PluginObject } from 'vue';
import * as enquire from 'enquire.js/dist/enquire';

/**
 * ... <= 320px
 */
export const BREAKING_POINT_UNTIL_EXTRA_SMALL: string = 'screen and (max-width:320px)';

/**
 * ... < 640
 */
export const BREAKING_POINT_UNTIL_SMALL: string = 'screen and (max-width:639px)';

/**
 * ... < 768
 */
export const BREAKING_POINT_UNTIL_MEDIUM: string = 'screen and (max-width:767px)';

/**
 * ... < 1024
 */
export const BREAKING_POINT_UNTIL_LARGE: string = 'screen and (max-width:1023px)';

/**
 * ... < 1400
 */
export const BREAKING_POINT_UNTIL_VERY_LARGE: string = 'screen and (max-width:1399px)';

/**
 * 320 > ... < 640
 */
export const BREAKING_POINT_SMALL: string = 'screen and (min-width: 321px) and (max-width:639px)';

/**
 * 639 > ... < 768
 */
export const BREAKING_POINT_MEDIUM: string = 'screen and (min-width: 640px) and (max-width:767px)';

/**
 * 767 > ... < 1024
 */
export const BREAKING_POINT_LARGE: string = 'screen and (min-width: 768px) and (max-width:1023px)';

/**
 * 320 > ...
 */
export const BREAKING_POINT_FROM_EXTRA_SMALL: string = 'screen and (min-width:321px)';

/**
 * 640 >= ...
 */
export const BREAKING_POINT_FROM_SMALL: string = 'screen and (min-width:640px)';

/**
 * 768 >= ...
 */
export const BREAKING_POINT_FROM_MEDIUM: string = 'screen and (min-width:768px)';

/**
 * 1024 >= ...
 */
export const BREAKING_POINT_FROM_LARGE: string = 'screen and (min-width:1024px)';

/**
 * 1400 >= ...
 */
export const BREAKING_POINT_FROM_VERY_LARGE: string = 'screen and (min-width:1400px)';

export class MediaQuery {
    private eventBus: Vue = new Vue();

    constructor() {
        this.registerEnquire(BREAKING_POINT_UNTIL_EXTRA_SMALL);
        this.registerEnquire(BREAKING_POINT_UNTIL_SMALL);
        this.registerEnquire(BREAKING_POINT_UNTIL_MEDIUM);
        this.registerEnquire(BREAKING_POINT_UNTIL_LARGE);
        this.registerEnquire(BREAKING_POINT_UNTIL_VERY_LARGE);

        this.registerEnquire(BREAKING_POINT_SMALL);
        this.registerEnquire(BREAKING_POINT_MEDIUM);
        this.registerEnquire(BREAKING_POINT_LARGE);

        this.registerEnquire(BREAKING_POINT_FROM_EXTRA_SMALL);
        this.registerEnquire(BREAKING_POINT_FROM_SMALL);
        this.registerEnquire(BREAKING_POINT_FROM_MEDIUM);
        this.registerEnquire(BREAKING_POINT_FROM_LARGE);
        this.registerEnquire(BREAKING_POINT_FROM_VERY_LARGE);
    }

    public register(breakingPoint: string, callback: () => void): void {
        this.eventBus.$on(breakingPoint, callback);

        // registration needed to be notified if breakpoint matches, always force unregister
        this.registerEnquire(breakingPoint, true);
    }

    public unregister(breakingPoint: string, callback: () => void): void {
        this.eventBus.$off(breakingPoint, callback);
    }

    private registerEnquire(breakingPoint: string, unregister?: boolean): void {
        let obj = {
            match: () => this.notify(breakingPoint)
        };

        // register needed in order to be notified if breakpoint matches.
        enquire.register(BREAKING_POINT_UNTIL_EXTRA_SMALL, obj);

        // registration from external components will always be unregistered.
        if (unregister) {
            enquire.unregister(BREAKING_POINT_UNTIL_EXTRA_SMALL, obj);
        }
    }

    private notify(breakingPoint: string): void {
        this.eventBus.$emit(breakingPoint);
    }
}

const MediaQueryPlugin: PluginObject<any> = {
    install(v, options) {
        let mediaQuery = new MediaQuery();
        (v as any).$mq = mediaQuery;
        (v.prototype as any).$mq = mediaQuery;
    }
};

export default MediaQueryPlugin;
