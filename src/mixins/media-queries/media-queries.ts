import Component from 'vue-class-component';

import { ModulVue } from '../../utils/vue/vue';
import { MediaQueriesStatus } from './../../utils/media-queries/media-queries';

export interface MediaQueriesMixin extends MediaQueriesStatus {}
@Component
export class MediaQueries extends ModulVue implements MediaQueriesStatus {
    public mqState: MediaQueriesStatus = this.$mq ? this.$mq.state : undefined as any;

    public get isMqMinXL(): boolean {
        return this.$mq.state.isMqMinXL;
    }
    public get isMqMinL(): boolean {
        return this.$mq.state.isMqMinL;
    }
    public get isMqMinM(): boolean {
        return this.$mq.state.isMqMinM;
    }
    public get isMqMinS(): boolean {
        return this.$mq.state.isMqMinS;
    }
    public get isMqMinXS(): boolean {
        return this.$mq.state.isMqMinXS;
    }
    public get isMqMaxXL(): boolean {
        return this.$mq.state.isMqMaxXL;
    }
    public get isMqMaxL(): boolean {
        return this.$mq.state.isMqMaxL;
    }
    public get isMqMaxM(): boolean {
        return this.$mq.state.isMqMaxM;
    }
    public get isMqMaxS(): boolean {
        return this.$mq.state.isMqMaxS;
    }
    public get isMqMaxXS(): boolean {
        return this.$mq.state.isMqMaxXS;
    }
    public get isMqS(): boolean {
        return this.$mq.state.isMqS;
    }
    public get isMqM(): boolean {
        return this.$mq.state.isMqM;
    }
    public get isMqL(): boolean {
        return this.$mq.state.isMqL;
    }
}
