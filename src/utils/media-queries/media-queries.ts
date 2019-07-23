import enquire from 'enquire.js/dist/enquire';
import { PluginObject } from 'vue';


/**
 * Augment the typings of Vue.js
 */

declare module 'vue/types/vue' {
    interface Vue {
        $mq: MediaQueries;
    }
}

export enum MediaQueriesBpMin {
    XL = '(min-width: 1600px)',
    L = '(min-width: 1200px)',
    M = '(min-width: 1024px)',
    S = '(min-width: 768px)',
    XS = '(min-width: 480px)',
    FROM_DESKTOP = XL,
    FROM_LAPTOP = L,
    FROM_TABLET_LANDSCAPE = M,
    FROM_TABLET_PORTRAIT = S,
    FROM_PHONE_PORTRAIT = XS
}

export enum MediaQueriesBpMax {
    XL = '(max-width: 1599px)',
    L = '(max-width: 1199px)',
    M = '(max-width: 1023px)',
    S = '(max-width: 767px)',
    XS = '(max-width: 479px)',
    LESS_THAN_DESKTOP = XL,
    LESS_THAN_LAPTOP = L,
    LESS_THAN_TABLET_LANDSCAPE = M,
    LESS_THAN_TABLET_PORTRAIT = S,
    LESS_THAN_PHONE_PORTRAIT = XS
}

export enum MediaQueriesBp {
    L = '(min-width: 1024px) and (max-width:1599px)',
    M = '(min-width: 768px) and (max-width: 1023px)',
    S = '(min-width: 480px) and (max-width: 767px)'
}

export interface MediaQueriesStatus {
    isMqMinXL: boolean;
    isMqMinL: boolean;
    isMqMinM: boolean;
    isMqMinS: boolean;
    isMqMinXS: boolean;

    isMqMaxXL: boolean;
    isMqMaxL: boolean;
    isMqMaxM: boolean;
    isMqMaxS: boolean;
    isMqMaxXS: boolean;

    isMqS: boolean;
    isMqM: boolean;
    isMqL: boolean;
}

export class MediaQueries {
    public state: MediaQueriesStatus = {
        isMqMinXL: false,
        isMqMinL: false,
        isMqMinM: false,
        isMqMinS: false,
        isMqMinXS: false,
        isMqMaxXL: false,
        isMqMaxL: false,
        isMqMaxM: false,
        isMqMaxS: false,
        isMqMaxXS: false,
        isMqS: false,
        isMqM: false,
        isMqL: false
    };

    constructor() {
        this.register(MediaQueriesBpMin.XL, () => this.state.isMqMinXL = true, () => this.state.isMqMinXL = false);
        this.register(MediaQueriesBpMin.L, () => this.state.isMqMinL = true, () => this.state.isMqMinL = false);
        this.register(MediaQueriesBpMin.M, () => this.state.isMqMinM = true, () => this.state.isMqMinM = false);
        this.register(MediaQueriesBpMin.S, () => this.state.isMqMinS = true, () => this.state.isMqMinS = false);
        this.register(MediaQueriesBpMin.XS, () => this.state.isMqMinXS = true, () => this.state.isMqMinXS = false);

        this.register(MediaQueriesBpMax.XL, () => this.state.isMqMaxXL = true, () => this.state.isMqMaxXL = false);
        this.register(MediaQueriesBpMax.L, () => this.state.isMqMaxL = true, () => this.state.isMqMaxL = false);
        this.register(MediaQueriesBpMax.M, () => this.state.isMqMaxM = true, () => this.state.isMqMaxM = false);
        this.register(MediaQueriesBpMax.S, () => this.state.isMqMaxS = true, () => this.state.isMqMaxS = false);
        this.register(MediaQueriesBpMax.XS, () => this.state.isMqMaxXS = true, () => this.state.isMqMaxXS = false);

        this.register(MediaQueriesBp.S, () => this.state.isMqS = true, () => this.state.isMqS = false);
        this.register(MediaQueriesBp.M, () => this.state.isMqM = true, () => this.state.isMqM = false);
        this.register(MediaQueriesBp.L, () => this.state.isMqL = true, () => this.state.isMqL = false);
    }

    private register(breakingPoint: string, match: () => void, unmatch: () => void): void {
        let obj: any = {
            match: () => match(),
            unmatch: () => unmatch()
        };

        enquire.register(breakingPoint, obj);
    }
}

const MediaQueriesPlugin: PluginObject<any> = {
    install(v): void {
        let mediaQueries: MediaQueries = new MediaQueries();
        (v.prototype).$mq = mediaQueries;
    }
};

export default MediaQueriesPlugin;
