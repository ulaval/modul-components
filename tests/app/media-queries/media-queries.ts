import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './media-queries.html';
import { MediaQueries, MediaQueriesMixin } from '../../../src/mixins/media-queries/media-queries';

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MediaQueriesTest extends Vue implements MediaQueriesMixin {
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
