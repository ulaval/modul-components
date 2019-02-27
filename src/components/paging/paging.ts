import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Emit, Model, Prop } from 'vue-property-decorator';
import { MediaQueries, MediaQueriesMixin } from '../../mixins/media-queries/media-queries';
import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { PAGING_NAME } from '../component-names';
import I18nPlugin from '../i18n/i18n';
import IconButtonPlugin from '../icon-button/icon-button';
import LinkPlugin from '../link/link';
import WithRender from './paging.html?style=./paging.scss';


const FIRST_PAGE: number = 1;
const DELTA_DESKTOP: number = 4;
const DELTA_MOBILE: number = 1;

export interface PagingItem {
    label: string;
    clickable: boolean;
    ellipsis?: boolean;
}

@WithRender
@Component({
    mixins: [MediaQueries]
})
export class MPaging extends ModulVue {
    @Model('change')
    @Prop({ default: FIRST_PAGE })
    public value: number;

    @Prop({ required: true })
    public nbOfItems: number;

    @Prop({ default: 20 })
    public nbOfItemsPerPage: number;

    @Prop({ default: false })
    loading: boolean;

    public get nbOfPages(): number {
        return Math.ceil(this.nbOfItems / this.nbOfItemsPerPage);
    }

    public get pagingItems(): PagingItem[] {
        let items: PagingItem[] = [];
        let delta: number = this.as<MediaQueriesMixin>().isMqMinS ? DELTA_DESKTOP : DELTA_MOBILE;
        let minDelta: number = this.value - delta < 2 ? 2 : this.value - delta;
        let maxDelta: number = this.value + delta > this.nbOfPages - 1 ? this.nbOfPages - 1 : this.value + delta;

        items.push({ label: FIRST_PAGE.toString(), clickable: FIRST_PAGE === this.value ? false : true });

        if (minDelta !== FIRST_PAGE + 1) {
            items.push({ label: this.$i18n.translate('m-paging:ellipsis'), clickable: false, ellipsis: true });
        }

        for (let i: number = minDelta; i <= maxDelta; i++) {
            items.push({ label: i.toString(), clickable: i === this.value ? false : true });
        }

        if (maxDelta !== this.nbOfPages - 1) {
            items.push({ label: this.$i18n.translate('m-paging:ellipsis'), clickable: false, ellipsis: true });
        }

        items.push({ label: this.nbOfPages.toString(), clickable: this.nbOfPages === this.value ? false : true });

        return items;
    }

    public get firstPageSelected(): boolean {
        return this.value === 1;
    }

    public get lastPageSelected(): boolean {
        return this.value === this.nbOfPages;
    }

    public get status(): string {
        return this.$i18n.translate('m-paging:status', { nbVisible: this.value, nbTotal: this.nbOfPages }, this.nbOfPages, undefined, undefined, FormatMode.Sprintf);
    }

    @Emit('change')
    goToPage(value: number): void { }
}

const PagingPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(IconButtonPlugin);
        v.use(LinkPlugin);
        v.use(I18nPlugin);
        v.component(PAGING_NAME, MPaging);
    }
};

export default PagingPlugin;
