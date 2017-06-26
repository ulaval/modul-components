import Vue, { PluginObject } from 'vue';
import * as enquire from 'enquire.js/dist/enquire';

// MIN-WIDTH

// 480px >= ...
export const BREAKING_POINT_MIN_EXTRA_SMALL: string = 'screen and (min-width:480px)';

// 768 >= ...
export const BREAKING_POINT_MIN_SMALL: string = 'screen and (min-width:768px)';

// 1024 >= ...
export const BREAKING_POINT_MIN_MEDIUM: string = 'screen and (min-width:1024px)';

// 1200 >= ...
export const BREAKING_POINT_MIN_LARGE: string = 'screen and (min-width:1200px)';

// MAX-WIDTH

// ... < 768
export const BREAKING_POINT_MAX_SMALL: string = 'screen and (max-width:767px)';

// ... < 1024
export const BREAKING_POINT_MAX_MEDIUM: string = 'screen and (max-width:1023px)';

// ... < 1200px
export const BREAKING_POINT_MAX_LARGE: string = 'screen and (max-width:1199px)';

// ... < 1600
export const BREAKING_POINT_MAX_EXTRA_LARGE: string = 'screen and (max-width:1599px)';

// MIN-WIDTH and MAX-WIDTH

// ... < 480
export const BREAKING_POINT_EXTRA_SMALL: string = 'screen and (max-width:479px)';

// 480 =­> ... < 768
export const BREAKING_POINT_SMALL: string = 'screen and (min-width:480px) and (max-width:767px)';

// 768 => ... < 1024
export const BREAKING_POINT_MEDIUM: string = 'screen and (min-width:768px) and (max-width:1023px)';

// 1024 => ... < 1600
export const BREAKING_POINT_LARGE: string = 'screen and (min-width:1024px) and (max-width:1599px)';

// 1600 >= ...
export const BREAKING_POINT_EXTRA_LARGE: string = 'screen and (min-width:1600px)';

const MATCH: string = 'match-';
const UNMATCH: string = 'unmatch-';

export class MediaQueries {
    private eventBus: Vue = new Vue();

    constructor() {
        this.registerEnquire(BREAKING_POINT_MIN_EXTRA_SMALL);
        this.registerEnquire(BREAKING_POINT_MIN_SMALL);
        this.registerEnquire(BREAKING_POINT_MIN_MEDIUM);
        this.registerEnquire(BREAKING_POINT_MIN_LARGE);

        this.registerEnquire(BREAKING_POINT_MAX_SMALL);
        this.registerEnquire(BREAKING_POINT_MAX_MEDIUM);
        this.registerEnquire(BREAKING_POINT_MAX_LARGE);
        this.registerEnquire(BREAKING_POINT_MAX_EXTRA_LARGE);

        this.registerEnquire(BREAKING_POINT_EXTRA_SMALL);
        this.registerEnquire(BREAKING_POINT_SMALL);
        this.registerEnquire(BREAKING_POINT_MEDIUM);
        this.registerEnquire(BREAKING_POINT_LARGE);
        this.registerEnquire(BREAKING_POINT_EXTRA_LARGE);
    }

    public register(breakingPoint: string, match: () => void, unmatch?: () => void): void {
        this.eventBus.$on(MATCH + breakingPoint, match);
        if (unmatch) {
            this.eventBus.$on(UNMATCH + breakingPoint, unmatch);
        }

        // registration needed to be notified if breakpoint matches, always force unregister
        this.registerEnquire(breakingPoint, true);
    }

    public unregister(breakingPoint: string, match: () => void, unmatch?: () => void): void {
        this.eventBus.$off(MATCH + breakingPoint, match);
        if (unmatch) {
            this.eventBus.$off(UNMATCH + breakingPoint, unmatch);
        }
    }

    private registerEnquire(breakingPoint: string, unregister?: boolean): void {
        let obj = {
            match: () => this.notify(MATCH + breakingPoint),
            unmatch: () => { if (!unregister) { this.notify(UNMATCH + breakingPoint); } }
        };

        // register needed in order to be notified if breakpoint matches.
        enquire.register(breakingPoint, obj);

        // registration from external components will always be unregistered.
        if (unregister) {
            enquire.unregister(breakingPoint, obj);
        }
    }

    private notify(breakingPoint: string): void {
        this.eventBus.$emit(breakingPoint);
    }
}

const MediaQueriesPlugin: PluginObject<any> = {
    install(v, options) {
        let mediaQueries = new MediaQueries();
        (v as any).$mq = mediaQueries;
        (v.prototype as any).$mq = mediaQueries;
    }
};

export default MediaQueriesPlugin;
