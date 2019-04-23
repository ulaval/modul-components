import { MToastPosition, MToastState } from '../../../components/toast/toast';
import { FormatMode } from '../../../utils/i18n/i18n';
import { ModulVue } from '../../../utils/vue/vue';
import { FormGroup } from '../form-control';


export enum FormActionType {
    InvalidSubmit,
    ValidSubmit,
    Reset
}

export type FormAfterActionEffect = {
    formActionType: FormActionType,
    afterEffect: (formGroup: FormGroup) => void;
};

export class FormBehavior {
    public static ClearToast: FormAfterActionEffect = {
        formActionType: FormActionType.Reset,
        afterEffect: (formGroup: FormGroup): void => {
            (ModulVue.prototype).$toast.clear();
        }
    };

    public static ErrorToast: FormAfterActionEffect = {
        formActionType: FormActionType.InvalidSubmit,
        afterEffect: (formGroup: FormGroup): void => {
            let htmlString: string = (ModulVue.prototype).$i18n.translate('m-form:multipleErrorsToCorrect', { totalNbOfErrors: formGroup.errors.length }, undefined, undefined, undefined, FormatMode.Sprintf);

            (ModulVue.prototype).$toast.show({
                position: MToastPosition.TopCenter,
                state: MToastState.Error,
                text: `<p>${htmlString}</p>`
            });
        }
    };

    public static ErrorFocus: FormAfterActionEffect = {
        formActionType: FormActionType.InvalidSubmit,
        afterEffect: (formGroup: FormGroup): void => {
            formGroup.controls.find(c => !c.isValid)!.focusGranted = true;
        }
    };

    public static ErrorMessages: FormAfterActionEffect = {
        formActionType: FormActionType.InvalidSubmit,
        afterEffect: (formGroup: FormGroup): void => {

        }
    };
}

export class MFormService {
    constructor(public readonly actions: FormAfterActionEffect[]) { }

    triggerEffet(actionType: FormActionType, formGroup: FormGroup): void {
        this.actions.filter(a => a.formActionType === actionType).forEach(a => a.afterEffect(formGroup));
    }
}
