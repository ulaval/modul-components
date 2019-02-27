import { MToastPosition, MToastState } from '../../../components/toast/toast';
import { FormatMode } from '../../../utils/i18n/i18n';
import { ModulVue } from '../../../utils/vue/vue';
import { Form } from '../form';


export interface MFormEventParams {
    form?: Form;
    totalNbOfErrors?: number;
    errorsToShowInMessagesCallback?: (errors: string[]) => void;
}

type ListenerCallback = (params?: MFormEventParams) => void;

export enum MFormEvents {
    formErrorClear,
    formError
}

export class MFormListener {
    constructor(public readonly eventType: MFormEvents, public readonly callback: ListenerCallback) { }
}

export class FormClearToastBehavior extends MFormListener {
    constructor() {
        super(MFormEvents.formErrorClear, () => {
            (ModulVue.prototype).$toast.clear();
        });
    }
}

export class FormErrorToastBehavior extends MFormListener {
    constructor() {
        super(MFormEvents.formError, (params) => {
            if (params && params.totalNbOfErrors && params.totalNbOfErrors > 1) {
                let htmlString: string = (ModulVue.prototype).$i18n.translate('m-form:multipleErrorsToCorrect', { totalNbOfErrors: params.totalNbOfErrors }, undefined, undefined, undefined, FormatMode.Sprintf);
                (ModulVue.prototype).$toast.show({
                    position: MToastPosition.TopCenter,
                    state: MToastState.Error,
                    text: `<p>${htmlString}</p>`
                });
            }
        });
    }
}

export class FormErrorFocusBehavior extends MFormListener {
    constructor() {
        super(MFormEvents.formError, (params) => {
            if (params && params.form) {
                params.form.focusFirstFieldWithError();
            }
        });
    }
}

export class FormErrorMessagesBehavior extends MFormListener {
    constructor() {
        super(MFormEvents.formError, (params) => {
            if (params && params.form && params.errorsToShowInMessagesCallback && (params.form.nbFieldsThatHasError > 1 || params.form.nbOfErrors > 0)) {
                params.errorsToShowInMessagesCallback(params.form.getErrorsForSummary());
            }
        });
    }
}

export class MFormService {

    private _listeners: MFormListener[] = [];

    constructor(listeners: MFormListener[]) {
        this._listeners = listeners;
    }

    get listeners(): MFormListener[] {
        return this._listeners;
    }

}
