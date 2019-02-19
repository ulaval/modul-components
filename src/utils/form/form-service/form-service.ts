import { PluginObject } from 'vue/types/plugin';
import { MToastPosition, MToastState } from '../../../components/toast/toast';
import { FormatMode } from '../../../utils/i18n/i18n';
import { ModulVue } from '../../../utils/vue/vue';
import { Form } from '../form';

declare module 'vue/types/vue' {
    interface Vue {
        $form: MFormService;
    }
}

export interface MFormEventParams {
    form?: Form;
    totalNbOfErrors?: number;
}

type ListenerCallback = (params?: MFormEventParams) => void;

export enum MFormEvents {
    formErrorClear,
    formError
}

export class MFormListener {
    constructor(public eventType: MFormEvents, public callback: ListenerCallback) { }
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

export class MFormService {

    public listeners: MFormListener[] = [];

    subscribe(listener: MFormListener): void {
        this.listeners.push(listener);
    }

    emit(eventType: MFormEvents, params?: any): void {
        this.listeners
            .filter((listener: MFormListener) => listener.eventType === eventType)
            .forEach((listener: MFormListener) => listener.callback(params));
    }
}


const MFormServicePlugin: PluginObject<any> = {
    install(v): void {
        let form: MFormService = new MFormService();
        (v.prototype).$form = form;
    }
};

export default MFormServicePlugin;
