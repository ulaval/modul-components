import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ERROR_PAGE_NOT_FOUND } from '../component-names';
import { Link } from '../error-template/error-template';
import WithRender from './error-page-not-found.sandbox.html';

@WithRender
@Component
export class MErrorPageNotFoundSandbox extends Vue {
    title: string = 'My custom page not found title';
    manyHints: string[] = ['My only custom hint', 'My second (long) custom hint.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla egestas urna rhoncus ipsum congue lobortis. Mauris vel neque condimentum, dignissim lectus ac, vehicula justo. Aliquam nunc leo, tristique hendrerit aliquam sagittis, scelerisque quis libero. Integer non augue nec lacus aliquet porttitor in nec lacus. Cras ultrices tellus est, condimentum gravida orci pulvinar quis. Integer eget turpis arcu. Curabitur consequat porta urna, at hendrerit justo consectetur non. Aenean venenatis ornare nulla, a vulputate erat eleifend ut.'];
    manyLinks: Link[] = [new Link('The first custom link', 'http://www.ulaval.ca'), new Link('The second custom link', 'http://www.google.com')];
}

const ErrorPageNotFoundSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ERROR_PAGE_NOT_FOUND}-sandbox`, MErrorPageNotFoundSandbox);
    }
};

export default ErrorPageNotFoundSandboxPlugin;
