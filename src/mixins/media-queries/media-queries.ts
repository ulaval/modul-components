import Component from 'vue-class-component';

import { ModulVue } from '../../utils/vue/vue';
import { MediaQueriesStatus } from './../../utils/media-queries/media-queries';

export interface MediaQueriesMixin extends MediaQueriesStatus {}
@Component
export class MediaQueries extends ModulVue implements MediaQueriesStatus {
    public mqState: MediaQueriesStatus = this.$mq.state;

    public get isMqMinXL(): boolean {
        return this.mqState.isMqMinXL;
    }
    public get isMqMinL(): boolean {
        return this.mqState.isMqMinL;
    }
    public get isMqMinM(): boolean {
        return this.mqState.isMqMinM;
    }
    public get isMqMinS(): boolean {
        return this.mqState.isMqMinS;
    }
    public get isMqMinXS(): boolean {
        return this.mqState.isMqMinXS;
    }
    public get isMqMaxXL(): boolean {
        return this.mqState.isMqMaxXL;
    }
    public get isMqMaxL(): boolean {
        return this.mqState.isMqMaxL;
    }
    public get isMqMaxM(): boolean {
        return this.mqState.isMqMaxM;
    }
    public get isMqMaxS(): boolean {
        return this.mqState.isMqMaxS;
    }
    public get isMqMaxXS(): boolean {
        return this.mqState.isMqMaxXS;
    }
    public get isMqS(): boolean {
        return this.mqState.isMqS;
    }
    public get isMqM(): boolean {
        return this.mqState.isMqM;
    }
    public get isMqL(): boolean {
        return this.mqState.isMqL;
    }
}
