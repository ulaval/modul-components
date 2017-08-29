import Vue, { PluginObject } from 'vue';
import * as enquire from 'enquire.js/dist/enquire';

export enum MediaQueriesBpMin {
    XL = '(min-width: 1600px)',
    L = '(min-width: 1200px)',
    M = '(min-width: 1024px)',
    S = '(min-width: 768px)',
    XS = '(min-width: 480px)'
}

export enum MediaQueriesBpMax {
    XL = '(max-width: 1599px)',
    L = '(max-width: 1199px)',
    M = '(max-width: 1023px)',
    S = '(max-width: 767px)',
    XS = '(max-width: 479px)'
}

export enum MediaQueriesBp {
    L = '(min-width: 1024px) and (max-width:1 599px)',
    M = '(min-width: 768px) and (max-width: 1023px)',
    S = '(min-width: 480px) and (max-width: 767px)'
}

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
