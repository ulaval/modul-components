import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { BREADCRUMBS_NAME } from '../component-names';
import IconPlugin from '../icon/icon';
import WithRender from './breadcrumbs.html?style=./breadcrumbs.scss';

export interface BreadcrumbItem {
    divider: string;
    iconName: string;
    disabled: boolean;
    text: string;
    url: string;
}

@WithRender
@Component
export class MBreadcrumbs extends Vue {

    @Prop({ default: [] })
    public items: BreadcrumbItem[];

    @Prop({ default: '/' })
    public divider: string;

    @Prop({ default: false })
    public disabled: boolean;
}

const BreadcrumbsPlugin: PluginObject<any> = {
    install(v): void {
        v.prototype.$log.debug(BREADCRUMBS_NAME, 'plugin.install');
        v.use(IconPlugin);
        v.component(BREADCRUMBS_NAME, MBreadcrumbs);
    }
};

export default BreadcrumbsPlugin;
