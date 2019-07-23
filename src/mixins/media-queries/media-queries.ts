import Component from 'vue-class-component';
import { MediaQueriesStatus } from '../../utils/media-queries/media-queries';
import { ModulVue } from '../../utils/vue/vue';


export interface MediaQueriesMixin extends MediaQueriesStatus { }
@Component
export class MediaQueries extends ModulVue implements MediaQueriesStatus {
    public mqState: MediaQueriesStatus = this.$mq ? this.$mq.state : undefined as any;

    public get isMqMinXL(): boolean {
        return this.$mq.state.isMqMinXL;
    }
    public get isMqFromDesktop(): boolean {
        return this.isMqMinXL;
    }

    public get isMqMinL(): boolean {
        return this.$mq.state.isMqMinL;
    }
    public get isMqFromLaptop(): boolean {
        return this.isMqMinL;
    }

    public get isMqMinM(): boolean {
        return this.$mq.state.isMqMinM;
    }
    public get isMqFromTabletLandscape(): boolean {
        return this.isMqMinM;
    }

    public get isMqMinS(): boolean {
        return this.$mq.state.isMqMinS;
    }
    public get isMqFromTabletPortrait(): boolean {
        return this.isMqMinS;
    }

    public get isMqMinXS(): boolean {
        return this.$mq.state.isMqMinXS;
    }
    public get isMqFromPhonePortrait(): boolean {
        return this.isMqMinXS;
    }

    public get isMqMaxXL(): boolean {
        return this.$mq.state.isMqMaxXL;
    }
    public get isMqLessThanDesktop(): boolean {
        return this.isMqMaxXL;
    }

    public get isMqMaxL(): boolean {
        return this.$mq.state.isMqMaxL;
    }
    public get isMqLessThanLaptop(): boolean {
        return this.isMqMaxL;
    }

    public get isMqMaxM(): boolean {
        return this.$mq.state.isMqMaxM;
    }
    public get isMqLessThanTabletLandscape(): boolean {
        return this.isMqMaxM;
    }

    public get isMqMaxS(): boolean {
        return this.$mq.state.isMqMaxS;
    }
    public get isMqLessThanTabletPortrait(): boolean {
        return this.isMqMaxS;
    }

    public get isMqMaxXS(): boolean {
        return this.$mq.state.isMqMaxXS;
    }
    public get isMqLessThanPhonePortrait(): boolean {
        return this.isMqMaxXS;
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
