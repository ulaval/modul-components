import Vue from 'vue';
import Component from 'vue-class-component';
import { ModulVue } from '../../utils/vue/vue';
import {
    BREAKING_POINT_MIN_EXTRA_SMALL,
    BREAKING_POINT_MIN_SMALL,
    BREAKING_POINT_MIN_MEDIUM,
    BREAKING_POINT_MIN_LARGE,
    BREAKING_POINT_MAX_SMALL,
    BREAKING_POINT_MAX_MEDIUM,
    BREAKING_POINT_MAX_LARGE,
    BREAKING_POINT_MAX_EXTRA_LARGE,
    BREAKING_POINT_EXTRA_SMALL,
    BREAKING_POINT_SMALL,
    BREAKING_POINT_MEDIUM,
    BREAKING_POINT_LARGE,
    BREAKING_POINT_EXTRA_LARGE
} from '../../utils/media-queries/media-queries';

export interface MediaQueriesMixin {
    isMinExtraSmall: boolean;
    isMinSmall: boolean;
    isMinMedium: boolean;
    isMinLarge: boolean;

    isExtraSmall: boolean;
    isSmall: boolean;
    isMedium: boolean;
    isLarge: boolean;
    isExtraLarge: boolean;

    isMaxSmall: boolean;
    isMaxMedium: boolean;
    isMaxLarge: boolean;
    isMaxExtraLarge: boolean;
}

@Component
export class MediaQueries extends ModulVue implements MediaQueriesMixin {
    public isMinExtraSmall: boolean = false;
    public isMinSmall: boolean = false;
    public isMinMedium: boolean = false;
    public isMinLarge: boolean = false;

    public isExtraSmall: boolean = false;
    public isSmall: boolean = false;
    public isMedium: boolean = false;
    public isLarge: boolean = false;
    public isExtraLarge: boolean = false;

    public isMaxSmall: boolean = false;
    public isMaxMedium: boolean = false;
    public isMaxLarge: boolean = false;
    public isMaxExtraLarge: boolean = false;

    private mqMinExtraSmallIn: () => void;
    private mqMinExtraSmallOut: () => void;
    private mqMinSmallIn: () => void;
    private mqMinSmallOut: () => void;
    private mqMinMediumIn: () => void;
    private mqMinMediumOut: () => void;
    private mqMinLargeIn: () => void;
    private mqMinLargeOut: () => void;

    private mqMaxSmallIn: () => void;
    private mqMaxSmallOut: () => void;
    private mqMaxMediumIn: () => void;
    private mqMaxMediumOut: () => void;
    private mqMaxLargeIn: () => void;
    private mqMaxLargeOut: () => void;
    private mqMaxExtraLargeIn: () => void;
    private mqMaxExtraLargeOut: () => void;

    private mqExtraSmallIn: () => void;
    private mqExtraSmallOut: () => void;
    private mqSmallIn: () => void;
    private mqSmallOut: () => void;
    private mqMediumIn: () => void;
    private mqMediumOut: () => void;
    private mqLargeIn: () => void;
    private mqLargeOut: () => void;
    private mqExtraLargeIn: () => void;
    private mqExtraLargeOut: () => void;

    public created(): void {
        this.mqMinExtraSmallIn = () => this.isMinExtraSmall = true;
        this.mqMinExtraSmallOut = () => this.isMinExtraSmall = false;
        this.mqMinSmallIn = () => this.isMinSmall = true;
        this.mqMinSmallOut = () => this.isMinSmall = false;
        this.mqMinMediumIn = () => this.isMinMedium = true;
        this.mqMinMediumOut = () => this.isMinMedium = false;
        this.mqMinLargeIn = () => this.isMinLarge = true;
        this.mqMinLargeOut = () => this.isMinLarge = false;

        this.mqMaxSmallIn = () => this.isMaxSmall = true;
        this.mqMaxSmallOut = () => this.isMaxSmall = false;
        this.mqMaxMediumIn = () => this.isMaxMedium = true;
        this.mqMaxMediumOut = () => this.isMaxMedium = false;
        this.mqMaxLargeIn = () => this.isMaxLarge = true;
        this.mqMaxLargeOut = () => this.isMaxLarge = false;
        this.mqMaxExtraLargeIn = () => this.isMaxExtraLarge = true;
        this.mqMaxExtraLargeOut = () => this.isMaxExtraLarge = false;

        this.mqExtraSmallIn = () => this.isExtraSmall = true;
        this.mqExtraSmallOut = () => this.isExtraSmall = false;
        this.mqSmallIn = () => this.isSmall = true;
        this.mqSmallOut = () => this.isSmall = false;
        this.mqMediumIn = () => this.isMedium = true;
        this.mqMediumOut = () => this.isMedium = false;
        this.mqLargeIn = () => this.isLarge = true;
        this.mqLargeOut = () => this.isLarge = false;
        this.mqExtraLargeIn = () => this.isExtraLarge = true;
        this.mqExtraLargeOut = () => this.isExtraLarge = false;
    }

    public mounted(): void {
        this.$mq.register(BREAKING_POINT_MIN_EXTRA_SMALL, this.mqMinExtraSmallIn, this.mqMinExtraSmallOut);
        this.$mq.register(BREAKING_POINT_MIN_SMALL, this.mqMinSmallIn, this.mqMinSmallOut);
        this.$mq.register(BREAKING_POINT_MIN_MEDIUM, this.mqMinMediumIn, this.mqMinMediumOut);
        this.$mq.register(BREAKING_POINT_MIN_LARGE, this.mqMinLargeIn, this.mqMinLargeOut);

        this.$mq.register(BREAKING_POINT_MAX_SMALL, this.mqMaxSmallIn, this.mqMaxSmallOut);
        this.$mq.register(BREAKING_POINT_MAX_MEDIUM, this.mqMaxMediumIn, this.mqMaxMediumOut);
        this.$mq.register(BREAKING_POINT_MAX_LARGE, this.mqMaxLargeIn, this.mqMaxLargeOut);
        this.$mq.register(BREAKING_POINT_MAX_EXTRA_LARGE, this.mqMaxExtraLargeIn, this.mqMaxExtraLargeOut);

        this.$mq.register(BREAKING_POINT_EXTRA_SMALL, this.mqExtraSmallIn, this.mqExtraSmallOut);
        this.$mq.register(BREAKING_POINT_SMALL, this.mqSmallIn, this.mqSmallOut);
        this.$mq.register(BREAKING_POINT_MEDIUM, this.mqMediumIn, this.mqMediumOut);
        this.$mq.register(BREAKING_POINT_LARGE, this.mqLargeIn, this.mqLargeOut);
        this.$mq.register(BREAKING_POINT_EXTRA_LARGE, this.mqExtraLargeIn, this.mqExtraLargeOut);
    }

    public destroyed(): void {
        this.$mq.register(BREAKING_POINT_MIN_EXTRA_SMALL, this.mqMinExtraSmallIn, this.mqMinExtraSmallOut);
        this.$mq.register(BREAKING_POINT_MIN_SMALL, this.mqMinSmallIn, this.mqMinSmallOut);
        this.$mq.register(BREAKING_POINT_MIN_MEDIUM, this.mqMinMediumIn, this.mqMinMediumOut);
        this.$mq.register(BREAKING_POINT_MIN_LARGE, this.mqMinLargeIn, this.mqMinLargeOut);

        this.$mq.register(BREAKING_POINT_MAX_SMALL, this.mqMaxSmallIn, this.mqMaxSmallOut);
        this.$mq.register(BREAKING_POINT_MAX_MEDIUM, this.mqMaxMediumIn, this.mqMaxMediumOut);
        this.$mq.register(BREAKING_POINT_MAX_LARGE, this.mqMaxLargeIn, this.mqMaxLargeOut);
        this.$mq.register(BREAKING_POINT_MAX_EXTRA_LARGE, this.mqMaxExtraLargeIn, this.mqMaxExtraLargeOut);

        this.$mq.register(BREAKING_POINT_EXTRA_SMALL, this.mqExtraSmallIn, this.mqExtraSmallOut);
        this.$mq.register(BREAKING_POINT_SMALL, this.mqSmallIn, this.mqSmallOut);
        this.$mq.register(BREAKING_POINT_MEDIUM, this.mqMediumIn, this.mqMediumOut);
        this.$mq.register(BREAKING_POINT_LARGE, this.mqLargeIn, this.mqLargeOut);
        this.$mq.register(BREAKING_POINT_EXTRA_LARGE, this.mqExtraLargeIn, this.mqExtraLargeOut);
    }
}
