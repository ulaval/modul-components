import Vue, { PluginObject } from 'vue';
import * as enquire from 'enquire.js/dist/enquire';

export enum MediaQueriesBpMin {
    XL = 'screen and (min-width:1600px)',
    L = 'screen and (min-width:1200px)',
    M = 'screen and (min-width:1024px)',
    S = 'screen and (min-width:768px)',
    XS = 'screen and (min-width:480px)'
}

export enum MediaQueriesBpMax {
    XL = 'screen and (max-width:1599px)',
    L = 'screen and (max-width:1199px)',
    M = 'screen and (max-width:1023px)',
    S = 'screen and (max-width:767px)',
    XS = 'screen and (max-width:479px)'
}

export enum MediaQueriesBp {
    L = 'screen and (min-width:1024px) and (max-width:1599px)',
    M = 'screen and (min-width:768px) and (max-width:1023px)',
    S = 'screen and (min-width:480px) and (max-width:767px)'
}

// MIN-WIDTH

// 480px >= ...
export const SCREEN_MIN_W_XS: string = 'screen and (min-width:480px)';

// 768 >= ...
export const SCREEN_MIN_W_S: string = 'screen and (min-width:768px)';

// 1024 >= ...
export const SCREEN_MIN_W_M: string = 'screen and (min-width:1024px)';

// 1200 >= ...
export const SCREEN_MIN_W_L: string = 'screen and (min-width:1200px)';

// MAX-WIDTH

// ... < 768
export const SCREEN_MAX_W_S: string = 'screen and (max-width:767px)';

// ... < 1024
export const SCREEN_MAX_W_M: string = 'screen and (max-width:1023px)';

// ... < 1200px
export const SCREEN_MAX_W_L: string = 'screen and (max-width:1199px)';

// ... < 1600
export const SCREEN_MAX_W_XL: string = 'screen and (max-width:1599px)';

// MIN-WIDTH and MAX-WIDTH

// ... < 480
export const SCREEN_W_XS: string = 'screen and (max-width:479px)';

// 480 =­> ... < 768
export const SCREEN_W_S: string = 'screen and (min-width:480px) and (max-width:767px)';

// 768 => ... < 1024
export const SCREEN_W_M: string = 'screen and (min-width:768px) and (max-width:1023px)';

// 1024 => ... < 1600
export const SCREEN_W_L: string = 'screen and (min-width:1024px) and (max-width:1599px)';

// 1600 >= ...
export const SCREEN_W_XL: string = 'screen and (min-width:1600px)';

const MATCH: string = 'match-';
const UNMATCH: string = 'unmatch-';

export class MediaQueries {
    private eventBus: Vue = new Vue();

    constructor() {
        this.registerEnquire(MediaQueriesBpMin.XL);
        this.registerEnquire(MediaQueriesBpMin.L);
        this.registerEnquire(MediaQueriesBpMin.M);
        this.registerEnquire(MediaQueriesBpMin.S);
        this.registerEnquire(MediaQueriesBpMin.XS);

        this.registerEnquire(MediaQueriesBpMax.XL);
        this.registerEnquire(MediaQueriesBpMax.L);
        this.registerEnquire(MediaQueriesBpMax.M);
        this.registerEnquire(MediaQueriesBpMax.S);
        this.registerEnquire(MediaQueriesBpMax.XS);

        this.registerEnquire(MediaQueriesBp.L);
        this.registerEnquire(MediaQueriesBp.M);
        this.registerEnquire(MediaQueriesBp.S);
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
