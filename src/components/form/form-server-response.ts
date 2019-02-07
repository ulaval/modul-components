import { Messages } from '../../utils/i18n/i18n';
import { MMessageState } from '../message/message';

/**
 * Class FormServerResponse
 */
export class FormServerResponse {
    private translationKey: string;
    private messageState: MMessageState;

    constructor(public status: number, public message: string) {
        if (this.status >= 100 && this.status < 200) {
            this.messageState = MMessageState.Information;
            this.translationKey = 'm-form:server-info-title';
        } else if (this.status >= 200 && this.status < 400) {
            this.messageState = MMessageState.Confirmation;
            this.translationKey = 'm-form:server-success-title';
        } else if (this.status >= 400 && this.status < 500) {
            this.messageState = MMessageState.Warning;
            this.translationKey = 'm-form:server-warning-title';
        } else {
            this.messageState = MMessageState.Error;
            this.translationKey = 'm-form:server-error-title';
        }
    }

    getTitle(i18n: Messages): string {
        return i18n.translate(this.translationKey);
    }

    getMessageState(): MMessageState {
        return this.messageState;
    }
}
