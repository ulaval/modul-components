import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import WithRender from './page-not-found.html';
import { Prop } from 'vue-property-decorator';
import { PAGE_NOT_FOUND_NAME } from '../component-names';

@WithRender
@Component
export class MPageNotFound extends Vue {
}

const PageNotFoundPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug(PAGE_NOT_FOUND_NAME, 'plugin.install');
        v.component(PAGE_NOT_FOUND_NAME, MPageNotFound);
    }
};

export default PageNotFoundPlugin;
