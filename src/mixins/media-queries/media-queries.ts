import { ModulVue } from '../../utils/vue/vue';
import Component from 'vue-class-component';
import { MediaQueriesBpMin, MediaQueriesBpMax, MediaQueriesBp } from '../../utils/media-queries/media-queries';

export interface MediaQueriesMixin {
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

@Component
export class MediaQueries extends ModulVue implements MediaQueriesMixin {
    public isMqMinXL: boolean = false;
    public isMqMinL: boolean = false;
    public isMqMinM: boolean = false;
    public isMqMinS: boolean = false;
    public isMqMinXS: boolean = false;

    public isMqMaxXL: boolean = false;
    public isMqMaxL: boolean = false;
    public isMqMaxM: boolean = false;
    public isMqMaxS: boolean = false;
    public isMqMaxXS: boolean = false;

    public isMqS: boolean = false;
    public isMqM: boolean = false;
    public isMqL: boolean = false;

    private mqMinXLIn: () => void;
    private mqMinXLOut: () => void;
    private mqMinLIn: () => void;
    private mqMinLOut: () => void;
    private mqMinMIn: () => void;
    private mqMinMOut: () => void;
    private mqMinSIn: () => void;
    private mqMinSOut: () => void;
    private mqMinXSIn: () => void;
    private mqMinXSOut: () => void;

    private mqMaxXLIn: () => void;
    private mqMaxXLOut: () => void;
    private mqMaxLIn: () => void;
    private mqMaxLOut: () => void;
    private mqMaxMIn: () => void;
    private mqMaxMOut: () => void;
    private mqMaxSIn: () => void;
    private mqMaxSOut: () => void;
    private mqMaxXSIn: () => void;
    private mqMaxXSOut: () => void;

    private mqLIn: () => void;
    private mqLOut: () => void;
    private mqMIn: () => void;
    private mqMOut: () => void;
    private mqSIn: () => void;
    private mqSOut: () => void;

    protected created(): void {
        if (!this.$mq) {
            throw new Error('MediaQueries mixin -> this.$mq is undefined, you must register the MediaQueries plugin.');
        }
        this.mqMinXLIn = () => this.isMqMinXL = true;
        this.mqMinXLOut = () => this.isMqMinXL = false;
        this.mqMinLIn = () => this.isMqMinL = true;
        this.mqMinLOut = () => this.isMqMinL = false;
        this.mqMinMIn = () => this.isMqMinM = true;
        this.mqMinMOut = () => this.isMqMinM = false;
        this.mqMinSIn = () => this.isMqMinS = true;
        this.mqMinSOut = () => this.isMqMinS = false;
        this.mqMinXSIn = () => this.isMqMinXS = true;
        this.mqMinXSOut = () => this.isMqMinXS = false;

        this.mqMaxXLIn = () => this.isMqMaxXL = true;
        this.mqMaxXLOut = () => this.isMqMaxXL = false;
        this.mqMaxLIn = () => this.isMqMaxL = true;
        this.mqMaxLOut = () => this.isMqMaxL = false;
        this.mqMaxMIn = () => this.isMqMaxM = true;
        this.mqMaxMOut = () => this.isMqMaxM = false;
        this.mqMaxSIn = () => this.isMqMaxS = true;
        this.mqMaxSOut = () => this.isMqMaxS = false;
        this.mqMaxXSIn = () => this.isMqMaxXS = true;
        this.mqMaxXSOut = () => this.isMqMaxXS = false;

        this.mqLIn = () => this.isMqL = true;
        this.mqLOut = () => this.isMqL = false;
        this.mqMIn = () => this.isMqM = true;
        this.mqMOut = () => this.isMqM = false;
        this.mqSIn = () => this.isMqS = true;
        this.mqSOut = () => this.isMqS = false;
    }

    protected beforeMount(): void {
        this.$mq.register(MediaQueriesBpMin.XL, this.mqMinXLIn, this.mqMinXLOut);
        this.$mq.register(MediaQueriesBpMin.L, this.mqMinLIn, this.mqMinLOut);
        this.$mq.register(MediaQueriesBpMin.M, this.mqMinMIn, this.mqMinMOut);
        this.$mq.register(MediaQueriesBpMin.S, this.mqMinSIn, this.mqMinSOut);
        this.$mq.register(MediaQueriesBpMin.XS, this.mqMinXSIn, this.mqMinXSOut);

        this.$mq.register(MediaQueriesBpMax.XL, this.mqMaxXLIn, this.mqMaxXLOut);
        this.$mq.register(MediaQueriesBpMax.L, this.mqMaxLIn, this.mqMaxLOut);
        this.$mq.register(MediaQueriesBpMax.M, this.mqMaxMIn, this.mqMaxMOut);
        this.$mq.register(MediaQueriesBpMax.S, this.mqMaxSIn, this.mqMaxSOut);
        this.$mq.register(MediaQueriesBpMax.XS, this.mqMaxXSIn, this.mqMaxXSOut);

        this.$mq.register(MediaQueriesBp.S, this.mqSIn, this.mqSOut);
        this.$mq.register(MediaQueriesBp.M, this.mqMIn, this.mqMOut);
        this.$mq.register(MediaQueriesBp.L, this.mqLIn, this.mqLOut);
    }

    protected beforeDestroy(): void {
        this.$mq.unregister(MediaQueriesBpMin.XL, this.mqMinXLIn, this.mqMinXLOut);
        this.$mq.unregister(MediaQueriesBpMin.L, this.mqMinLIn, this.mqMinLOut);
        this.$mq.unregister(MediaQueriesBpMin.M, this.mqMinMIn, this.mqMinMOut);
        this.$mq.unregister(MediaQueriesBpMin.S, this.mqMinSIn, this.mqMinSOut);
        this.$mq.unregister(MediaQueriesBpMin.XS, this.mqMinXSIn, this.mqMinXSOut);

        this.$mq.unregister(MediaQueriesBpMax.XL, this.mqMaxXLIn, this.mqMaxXLOut);
        this.$mq.unregister(MediaQueriesBpMax.L, this.mqMaxLIn, this.mqMaxLOut);
        this.$mq.unregister(MediaQueriesBpMax.M, this.mqMaxMIn, this.mqMaxMOut);
        this.$mq.unregister(MediaQueriesBpMax.S, this.mqMaxSIn, this.mqMaxSOut);
        this.$mq.unregister(MediaQueriesBpMax.XS, this.mqMaxXSIn, this.mqMaxXSOut);

        this.$mq.unregister(MediaQueriesBp.S, this.mqSIn, this.mqSOut);
        this.$mq.unregister(MediaQueriesBp.M, this.mqMIn, this.mqMOut);
        this.$mq.unregister(MediaQueriesBp.L, this.mqLIn, this.mqLOut);
    }
}
