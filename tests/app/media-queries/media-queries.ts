import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './media-queries.html';
import { ModulVue } from '../../../src/utils/vue';
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
} from '../../../src/utils/media-queries';

@WithRender
@Component
export class MediaQueries extends ModulVue {
    private isMinExtraSmall: boolean = false;
    private isMinSmall: boolean = false;
    private isMinMedium: boolean = false;
    private isMinLarge: boolean = false;

    private isExtraSmall: boolean = false;
    private isSmall: boolean = false;
    private isMedium: boolean = false;
    private isLarge: boolean = false;
    private isExtraLarge: boolean = false;

    private isMaxSmall: boolean = false;
    private isMaxMedium: boolean = false;
    private isMaxLarge: boolean = false;
    private isMaxExtraLarge: boolean = false;

    private mqMinExSmallIn: () => void;
    private mqMinExSmallOut: () => void;
    private mqMinSmallIn: () => void;
    private mqMinSmallOut: () => void;
    private mqMinMedIn: () => void;
    private mqMinMedOut: () => void;
    private mqMinLgIn: () => void;
    private mqMinLgOut: () => void;

    private mqMaxSmallIn: () => void;
    private mqMaxSmallOut: () => void;
    private mqMaxMedIn: () => void;
    private mqMaxMedOut: () => void;
    private mqMaxLgIn: () => void;
    private mqMaxLgOut: () => void;
    private mqMaxExLgIn: () => void;
    private mqMaxExLgOut: () => void;

    private mqExSmallIn: () => void;
    private mqExSmallOut: () => void;
    private mqSmallIn: () => void;
    private mqSmallOut: () => void;
    private mqMedIn: () => void;
    private mqMedOut: () => void;
    private mqLgIn: () => void;
    private mqLgOut: () => void;
    private mqExLgIn: () => void;
    private mqExLgOut: () => void;

    public created(): void {
        this.mqMinExSmallIn = () => this.isMinExtraSmall = true;
        this.mqMinExSmallOut = () => this.isMinExtraSmall = false;
        this.mqMinSmallIn = () => this.isMinSmall = true;
        this.mqMinSmallOut = () => this.isMinSmall = false;
        this.mqMinMedIn = () => this.isMinMedium = true;
        this.mqMinMedOut = () => this.isMinMedium = false;
        this.mqMinLgIn = () => this.isMinLarge = true;
        this.mqMinLgOut = () => this.isMinLarge = false;

        this.mqMaxSmallIn = () => this.isMaxSmall = true;
        this.mqMaxSmallOut = () => this.isMaxSmall = false;
        this.mqMaxMedIn = () => this.isMaxMedium = true;
        this.mqMaxMedOut = () => this.isMaxMedium = false;
        this.mqMaxLgIn = () => this.isMaxLarge = true;
        this.mqMaxLgOut = () => this.isMaxLarge = false;
        this.mqMaxExLgIn = () => this.isMaxExtraLarge = true;
        this.mqMaxExLgOut = () => this.isMaxExtraLarge = false;

        this.mqExSmallIn = () => this.isExtraSmall = true;
        this.mqExSmallOut = () => this.isExtraSmall = false;
        this.mqSmallIn = () => this.isSmall = true;
        this.mqSmallOut = () => this.isSmall = false;
        this.mqMedIn = () => this.isMedium = true;
        this.mqMedOut = () => this.isMedium = false;
        this.mqLgIn = () => this.isLarge = true;
        this.mqLgOut = () => this.isLarge = false;
        this.mqExLgIn = () => this.isExtraLarge = true;
        this.mqExLgOut = () => this.isExtraLarge = false;
    }

    public mounted(): void {
        this.$mq.register(BREAKING_POINT_MIN_EXTRA_SMALL, this.mqMinExSmallIn, this.mqMinExSmallOut);
        this.$mq.register(BREAKING_POINT_MIN_SMALL, this.mqMinSmallIn, this.mqMinSmallOut);
        this.$mq.register(BREAKING_POINT_MIN_MEDIUM, this.mqMinMedIn, this.mqMinMedOut);
        this.$mq.register(BREAKING_POINT_MIN_LARGE, this.mqMinLgIn, this.mqMinLgOut);

        this.$mq.register(BREAKING_POINT_MAX_SMALL, this.mqMaxSmallIn, this.mqMaxSmallOut);
        this.$mq.register(BREAKING_POINT_MAX_MEDIUM, this.mqMaxMedIn, this.mqMaxMedOut);
        this.$mq.register(BREAKING_POINT_MAX_LARGE, this.mqMaxLgIn, this.mqMaxLgOut);
        this.$mq.register(BREAKING_POINT_MAX_EXTRA_LARGE, this.mqMaxExLgIn, this.mqMaxExLgOut);

        this.$mq.register(BREAKING_POINT_EXTRA_SMALL, this.mqExSmallIn, this.mqExSmallOut);
        this.$mq.register(BREAKING_POINT_SMALL, this.mqSmallIn, this.mqSmallOut);
        this.$mq.register(BREAKING_POINT_MEDIUM, this.mqMedIn, this.mqMedOut);
        this.$mq.register(BREAKING_POINT_LARGE, this.mqLgIn, this.mqLgOut);
        this.$mq.register(BREAKING_POINT_EXTRA_LARGE, this.mqExLgIn, this.mqExLgOut);
    }

    public destroyed(): void {
        this.$mq.register(BREAKING_POINT_MIN_EXTRA_SMALL, this.mqMinExSmallIn, this.mqMinExSmallOut);
        this.$mq.register(BREAKING_POINT_MIN_SMALL, this.mqMinSmallIn, this.mqMinSmallOut);
        this.$mq.register(BREAKING_POINT_MIN_MEDIUM, this.mqMinMedIn, this.mqMinMedOut);
        this.$mq.register(BREAKING_POINT_MIN_LARGE, this.mqMinLgIn, this.mqMinLgOut);

        this.$mq.register(BREAKING_POINT_MAX_SMALL, this.mqMaxSmallIn, this.mqMaxSmallOut);
        this.$mq.register(BREAKING_POINT_MAX_MEDIUM, this.mqMaxMedIn, this.mqMaxMedOut);
        this.$mq.register(BREAKING_POINT_MAX_LARGE, this.mqMaxLgIn, this.mqMaxLgOut);
        this.$mq.register(BREAKING_POINT_MAX_EXTRA_LARGE, this.mqMaxExLgIn, this.mqMaxExLgOut);

        this.$mq.register(BREAKING_POINT_EXTRA_SMALL, this.mqExSmallIn, this.mqExSmallOut);
        this.$mq.register(BREAKING_POINT_SMALL, this.mqSmallIn, this.mqSmallOut);
        this.$mq.register(BREAKING_POINT_MEDIUM, this.mqMedIn, this.mqMedOut);
        this.$mq.register(BREAKING_POINT_LARGE, this.mqLgIn, this.mqLgOut);
        this.$mq.register(BREAKING_POINT_EXTRA_LARGE, this.mqExLgIn, this.mqExLgOut);
    }
}
