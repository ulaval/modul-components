import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './media-query.html';
import { ModulVue } from '../../../src/utils/vue';
import {
    BREAKING_POINT_FROM_EXTRA_SMALL, BREAKING_POINT_FROM_LARGE, BREAKING_POINT_FROM_MEDIUM, BREAKING_POINT_FROM_SMALL, BREAKING_POINT_FROM_VERY_LARGE,
    BREAKING_POINT_LARGE, BREAKING_POINT_MEDIUM, BREAKING_POINT_SMALL, BREAKING_POINT_UNTIL_EXTRA_SMALL, BREAKING_POINT_UNTIL_LARGE, BREAKING_POINT_UNTIL_MEDIUM,
    BREAKING_POINT_UNTIL_SMALL, BREAKING_POINT_UNTIL_VERY_LARGE
} from '../../../src/utils/media-query';

@WithRender
@Component
export class MediaQuery extends ModulVue {
    private untilExtraSmall: boolean = false;
    private untilSmall: boolean = false;
    private untilMedium: boolean = false;
    private untilLarge: boolean = false;
    private untilExtraLarge: boolean = false;
    private isSmall: boolean = false;
    private isMedium: boolean = false;
    private isLarge: boolean = false;
    private fromExtraSmall: boolean = false;
    private fromSmall: boolean = false;
    private fromMedium: boolean = false;
    private fromLarge: boolean = false;
    private fromExtraLarge: boolean = false;

    private mquExSmallIn: () => void;
    private mquExSmallOut: () => void;
    private mquSmallIn: () => void;
    private mquSmallOut: () => void;
    private mquMedIn: () => void;
    private mquMedOut: () => void;
    private mquLgIn: () => void;
    private mquLgOut: () => void;
    private mquExLgIn: () => void;
    private mquExLgOut: () => void;

    private mqisSmallIn: () => void;
    private mqisSmallOut: () => void;
    private mqisMedIn: () => void;
    private mqisMedOut: () => void;
    private mqisLgIn: () => void;
    private mqisLgOut: () => void;

    private mqfExSmallIn: () => void;
    private mqfExSmallOut: () => void;
    private mqfSmallIn: () => void;
    private mqfSmallOut: () => void;
    private mqfMedIn: () => void;
    private mqfMedOut: () => void;
    private mqfLgIn: () => void;
    private mqfLgOut: () => void;
    private mqfExLgIn: () => void;
    private mqfExLgOut: () => void;

    public created(): void {
        this.mquExSmallIn = () => this.untilExtraSmall = true;
        this.mquExSmallOut = () => this.untilExtraSmall = false;
        this.mquSmallIn = () => this.untilSmall = true;
        this.mquSmallOut = () => this.untilSmall = false;
        this.mquMedIn = () => this.untilMedium = true;
        this.mquMedOut = () => this.untilMedium = false;
        this.mquLgIn = () => this.untilLarge = true;
        this.mquLgOut = () => this.untilLarge = false;
        this.mquExLgIn = () => this.untilExtraLarge = true;
        this.mquExLgOut = () => this.untilExtraLarge = false;

        this.mqisSmallIn = () => this.isSmall = true;
        this.mqisSmallOut = () => this.isSmall = false;
        this.mqisMedIn = () => this.isMedium = true;
        this.mqisMedOut = () => this.isMedium = false;
        this.mqisLgIn = () => this.isLarge = true;
        this.mqisLgOut = () => this.isLarge = false;

        this.mqfExSmallIn = () => this.fromExtraSmall = true;
        this.mqfExSmallOut = () => this.fromExtraSmall = false;
        this.mqfSmallIn = () => this.fromSmall = true;
        this.mqfSmallOut = () => this.fromSmall = false;
        this.mqfMedIn = () => this.fromMedium = true;
        this.mqfMedOut = () => this.fromMedium = false;
        this.mqfLgIn = () => this.fromLarge = true;
        this.mqfLgOut = () => this.fromLarge = false;
        this.mqfExLgIn = () => this.fromExtraLarge = true;
        this.mqfExLgOut = () => this.fromExtraLarge = false;
    }

    public mounted(): void {
        this.$mq.register(BREAKING_POINT_UNTIL_EXTRA_SMALL, this.mquExSmallIn, this.mquExSmallOut);
        this.$mq.register(BREAKING_POINT_UNTIL_SMALL, this.mquSmallIn, this.mquSmallOut);
        this.$mq.register(BREAKING_POINT_UNTIL_MEDIUM, this.mquMedIn, this.mquMedOut);
        this.$mq.register(BREAKING_POINT_UNTIL_LARGE, this.mquLgIn, this.mquLgOut);
        this.$mq.register(BREAKING_POINT_UNTIL_VERY_LARGE, this.mquExLgIn, this.mquExLgOut);

        this.$mq.register(BREAKING_POINT_SMALL, this.mqisSmallIn, this.mqisSmallOut);
        this.$mq.register(BREAKING_POINT_MEDIUM, this.mqisMedIn, this.mqisMedOut);
        this.$mq.register(BREAKING_POINT_LARGE, this.mqisLgIn, this.mqisLgOut);

        this.$mq.register(BREAKING_POINT_FROM_EXTRA_SMALL, this.mqfExSmallIn, this.mqfExSmallOut);
        this.$mq.register(BREAKING_POINT_FROM_SMALL, this.mqfSmallIn, this.mqfSmallOut);
        this.$mq.register(BREAKING_POINT_FROM_MEDIUM, this.mqfMedIn, this.mqfMedOut);
        this.$mq.register(BREAKING_POINT_FROM_LARGE, this.mqfLgIn, this.mqfLgOut);
        this.$mq.register(BREAKING_POINT_FROM_VERY_LARGE, this.mqfExLgIn, this.mqfExLgOut);
    }

    public destroyed(): void {
        this.$mq.unregister(BREAKING_POINT_UNTIL_EXTRA_SMALL, this.mquExSmallIn, this.mquExSmallOut);
        this.$mq.unregister(BREAKING_POINT_UNTIL_SMALL, this.mquSmallIn, this.mquSmallOut);
        this.$mq.unregister(BREAKING_POINT_UNTIL_MEDIUM, this.mquMedIn, this.mquMedOut);
        this.$mq.unregister(BREAKING_POINT_UNTIL_LARGE, this.mquLgIn, this.mquLgOut);
        this.$mq.unregister(BREAKING_POINT_UNTIL_VERY_LARGE, this.mquExLgIn, this.mquExLgOut);

        this.$mq.unregister(BREAKING_POINT_SMALL, this.mqisSmallIn, this.mqisSmallOut);
        this.$mq.unregister(BREAKING_POINT_MEDIUM, this.mqisMedIn, this.mqisMedOut);
        this.$mq.unregister(BREAKING_POINT_LARGE, this.mqisLgIn, this.mqisLgOut);

        this.$mq.unregister(BREAKING_POINT_FROM_EXTRA_SMALL, this.mqfExSmallIn, this.mqfExSmallOut);
        this.$mq.unregister(BREAKING_POINT_FROM_SMALL, this.mqfSmallIn, this.mqfSmallOut);
        this.$mq.unregister(BREAKING_POINT_FROM_MEDIUM, this.mqfMedIn, this.mqfMedOut);
        this.$mq.unregister(BREAKING_POINT_FROM_LARGE, this.mqfLgIn, this.mqfLgOut);
        this.$mq.unregister(BREAKING_POINT_FROM_VERY_LARGE, this.mqfExLgIn, this.mqfExLgOut);
    }
}
