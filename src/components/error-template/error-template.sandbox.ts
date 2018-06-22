import moment from 'moment';
import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ERROR_TEMPLATE_NAME } from '../component-names';
import { MMessageState } from '../message/message';
import WithRender from './error-template.sandbox.html';

@WithRender
@Component
export class MErrorTemplateSandbox extends Vue {
    errorType: MMessageState = MMessageState.Error;
    warningType: MMessageState = MMessageState.Warning;
    informationType: MMessageState = MMessageState.Information;
    title: string = 'My error title';
    oneHint: string[] = ['My only hint'];
    manyHints: string[] = ['My first hint', 'My second long hint.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla egestas urna rhoncus ipsum congue lobortis. Mauris vel neque condimentum, dignissim lectus ac, vehicula justo. Aliquam nunc leo, tristique hendrerit aliquam sagittis, scelerisque quis libero. Integer non augue nec lacus aliquet porttitor in nec lacus. Cras ultrices tellus est, condimentum gravida orci pulvinar quis. Integer eget turpis arcu. Curabitur consequat porta urna, at hendrerit justo consectetur non. Aenean venenatis ornare nulla, a vulputate erat eleifend ut.'];
    oneLink: { url: string, label: string }[] = [{ url: 'http://www.ulaval.ca', label: 'the only link' }];
    manyLinks: { url: string, label: string }[] = [{ url: 'http://www.ulaval.ca', label: 'the first link' }, { url: 'http://www.google.com', label: 'the second link' }];
    errorDate: moment.Moment = moment().subtract(moment.duration(2, 'days'));
    stackTrace: string = `(l1) This is a multiline stack
(l2) to be displayed
(l3) in the error page.`;
}

const ErrorTemplateSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ERROR_TEMPLATE_NAME}-sandbox`, MErrorTemplateSandbox);
    }
};

export default ErrorTemplateSandboxPlugin;
