import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './media-queries.html';
import { MediaQueries } from '../../../src/mixins/media-queries/media-queries';

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MediaQueriesTest extends Vue {
}
