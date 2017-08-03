import Vue from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import {
    SCREEN_MIN_W_XS,
    SCREEN_MIN_W_S,
    SCREEN_MIN_W_M,
    SCREEN_MIN_W_L,
    SCREEN_MAX_W_S,
    SCREEN_MAX_W_M,
    SCREEN_MAX_W_L,
    SCREEN_MAX_W_XL,
    SCREEN_W_XS,
    SCREEN_W_S,
    SCREEN_W_M,
    SCREEN_W_L,
    SCREEN_W_XL
} from '../../utils/media-queries/media-queries';

export interface MediaQueriesMixin {
    isScreenMinXS: boolean;
    isScreenMinS: boolean;
    isScreenMinM: boolean;
    isScreenMinL: boolean;

    isScreenXS: boolean;
    isScreenS: boolean;
    isScreenM: boolean;
    isScreenL: boolean;
    isScreenXL: boolean;

    isScreenMaxS: boolean;
    isScreenMaxM: boolean;
    isScreenMaxL: boolean;
    isScreenMaxXL: boolean;
}

@Component
export class MediaQueries extends ModulVue implements MediaQueriesMixin {
    public isScreenMinXS: boolean = false;
    public isScreenMinS: boolean = false;
    public isScreenMinM: boolean = false;
    public isScreenMinL: boolean = false;

    public isScreenXS: boolean = false;
    public isScreenS: boolean = false;
    public isScreenM: boolean = false;
    public isScreenL: boolean = false;
    public isScreenXL: boolean = false;

    public isScreenMaxS: boolean = false;
    public isScreenMaxM: boolean = false;
    public isScreenMaxL: boolean = false;
    public isScreenMaxXL: boolean = false;

    private screenMinXSIn: () => void;
    private screenMinXSOut: () => void;
    private screenMinSIn: () => void;
    private screenMinSOut: () => void;
    private screenMinMIn: () => void;
    private screenMinMOut: () => void;
    private screenMinLIn: () => void;
    private screenMinLOut: () => void;

    private screenMaxSIn: () => void;
    private screenMaxSOut: () => void;
    private screenMaxMIn: () => void;
    private screenMaxMOut: () => void;
    private screenMaxLIn: () => void;
    private screenMaxLOut: () => void;
    private screenMaxXLIn: () => void;
    private screenMaxXLOut: () => void;

    private screenXSIn: () => void;
    private screenXSOut: () => void;
    private screenSIn: () => void;
    private screenSOut: () => void;
    private screenMIn: () => void;
    private screenMOut: () => void;
    private screenLIn: () => void;
    private screenLOut: () => void;
    private screenXLIn: () => void;
    private screenXLOut: () => void;

    protected created(): void {
        this.screenMinXSIn = () => this.isScreenMinXS = true;
        this.screenMinXSOut = () => this.isScreenMinXS = false;
        this.screenMinSIn = () => this.isScreenMinS = true;
        this.screenMinSOut = () => this.isScreenMinS = false;
        this.screenMinMIn = () => this.isScreenMinM = true;
        this.screenMinMOut = () => this.isScreenMinM = false;
        this.screenMinLIn = () => this.isScreenMinL = true;
        this.screenMinLOut = () => this.isScreenMinL = false;

        this.screenMaxSIn = () => this.isScreenMaxS = true;
        this.screenMaxSOut = () => this.isScreenMaxS = false;
        this.screenMaxMIn = () => this.isScreenMaxM = true;
        this.screenMaxMOut = () => this.isScreenMaxM = false;
        this.screenMaxLIn = () => this.isScreenMaxL = true;
        this.screenMaxLOut = () => this.isScreenMaxL = false;
        this.screenMaxXLIn = () => this.isScreenMaxXL = true;
        this.screenMaxXLOut = () => this.isScreenMaxXL = false;

        this.screenXSIn = () => this.isScreenXS = true;
        this.screenXSOut = () => this.isScreenXS = false;
        this.screenSIn = () => this.isScreenS = true;
        this.screenSOut = () => this.isScreenS = false;
        this.screenMIn = () => this.isScreenM = true;
        this.screenMOut = () => this.isScreenM = false;
        this.screenLIn = () => this.isScreenL = true;
        this.screenLOut = () => this.isScreenL = false;
        this.screenXLIn = () => this.isScreenXL = true;
        this.screenXLOut = () => this.isScreenXL = false;
    }

    protected mounted(): void {
        this.$mq.register(SCREEN_MIN_W_XS, this.screenMinXSIn, this.screenMinXSOut);
        this.$mq.register(SCREEN_MIN_W_S, this.screenMinSIn, this.screenMinSOut);
        this.$mq.register(SCREEN_MIN_W_M, this.screenMinMIn, this.screenMinMOut);
        this.$mq.register(SCREEN_MIN_W_L, this.screenMinLIn, this.screenMinLOut);

        this.$mq.register(SCREEN_MAX_W_S, this.screenMaxSIn, this.screenMaxSOut);
        this.$mq.register(SCREEN_MAX_W_M, this.screenMaxMIn, this.screenMaxMOut);
        this.$mq.register(SCREEN_MAX_W_L, this.screenMaxLIn, this.screenMaxLOut);
        this.$mq.register(SCREEN_MAX_W_XL, this.screenMaxXLIn, this.screenMaxXLOut);

        this.$mq.register(SCREEN_W_XS, this.screenXSIn, this.screenXSOut);
        this.$mq.register(SCREEN_W_S, this.screenSIn, this.screenSOut);
        this.$mq.register(SCREEN_W_M, this.screenMIn, this.screenMOut);
        this.$mq.register(SCREEN_W_L, this.screenLIn, this.screenLOut);
        this.$mq.register(SCREEN_W_XL, this.screenXLIn, this.screenXLOut);
    }

    protected destroyed(): void {
        this.$mq.unregister(SCREEN_MIN_W_XS, this.screenMinXSIn, this.screenMinXSOut);
        this.$mq.unregister(SCREEN_MIN_W_S, this.screenMinSIn, this.screenMinSOut);
        this.$mq.unregister(SCREEN_MIN_W_M, this.screenMinMIn, this.screenMinMOut);
        this.$mq.unregister(SCREEN_MIN_W_L, this.screenMinLIn, this.screenMinLOut);

        this.$mq.unregister(SCREEN_MAX_W_S, this.screenMaxSIn, this.screenMaxSOut);
        this.$mq.unregister(SCREEN_MAX_W_M, this.screenMaxMIn, this.screenMaxMOut);
        this.$mq.unregister(SCREEN_MAX_W_L, this.screenMaxLIn, this.screenMaxLOut);
        this.$mq.unregister(SCREEN_MAX_W_XL, this.screenMaxXLIn, this.screenMaxXLOut);

        this.$mq.unregister(SCREEN_W_XS, this.screenXSIn, this.screenXSOut);
        this.$mq.unregister(SCREEN_W_S, this.screenSIn, this.screenSOut);
        this.$mq.unregister(SCREEN_W_M, this.screenMIn, this.screenMOut);
        this.$mq.unregister(SCREEN_W_L, this.screenLIn, this.screenLOut);
        this.$mq.unregister(SCREEN_W_XL, this.screenXLIn, this.screenXLOut);
    }
}
