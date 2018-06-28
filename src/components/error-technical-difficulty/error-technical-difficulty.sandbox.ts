import moment from 'moment';
import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';

import { ERROR_TECHNICAL_DIFFICULTY_NAME } from '../component-names';
import { Link } from '../error-template/error-template';
import WithRender from './error-technical-difficulty.sandbox.html';

@WithRender
@Component
export class MErrorTechnicalDifficultySandbox extends Vue {
    title: string = 'My custom technical error title';
    oneHint: string[] = ['My only custom hint'];
    manyHints: string[] = ['My only custom hint', 'My second (long) custom hint.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla egestas urna rhoncus ipsum congue lobortis. Mauris vel neque condimentum, dignissim lectus ac, vehicula justo. Aliquam nunc leo, tristique hendrerit aliquam sagittis, scelerisque quis libero. Integer non augue nec lacus aliquet porttitor in nec lacus. Cras ultrices tellus est, condimentum gravida orci pulvinar quis. Integer eget turpis arcu. Curabitur consequat porta urna, at hendrerit justo consectetur non. Aenean venenatis ornare nulla, a vulputate erat eleifend ut.'];
    oneLink: Link[] = [new Link('The first custom link', 'http://www.ulaval.ca', true)];
    manyLinks: Link[] = [new Link('The first custom link', 'http://www.ulaval.ca', true), new Link('The second custom link', 'http://www.google.com', true)];
    errorDate: moment.Moment = moment().subtract(moment.duration(2, 'days'));
    referenceNumber: string = `referenceNumberXXX`;

    get errorWithStack(): Error {
        let error: Error = new Error('Error message');
        error.stack = `This is a stack\n\rwith two lines`;
        return error;
    }
    get errorwithoutStack(): Error {
        let error: Error = new Error('Error message');
        return error;
    }
}

const ErrorTechnicalDifficultySandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.component(`${ERROR_TECHNICAL_DIFFICULTY_NAME}-sandbox`, MErrorTechnicalDifficultySandbox);
    }
};

export default ErrorTechnicalDifficultySandboxPlugin;
