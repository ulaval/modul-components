import { MForm } from '../../components/form/form';
import { MToastPosition, MToastState } from '../../components/toast/toast';
import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';

export enum FormActionType {
    None = 0 << 0,
    InvalidSubmit = 1 << 1,
    ValidSubmit = 2 << 2,
    Reset = 4 << 4,
    Destroy = 8 << 8,
    ValidSubmitOrReset = ValidSubmit | Reset,
    ValidSubmitOrResetOrDestroy = ValidSubmit | Reset | Destroy
}

export type FormAfterActionEffect = {
    formActionType: FormActionType,
    afterEffect: (form: MForm) => void;
};

export class FormAfterActionEffects {
    public static ClearErrorToast: FormAfterActionEffect = {
        formActionType: FormActionType.ValidSubmitOrResetOrDestroy,
        afterEffect: (form: MForm): void => {
            (ModulVue.prototype).$toast.clear();
        }
    };

    public static ErrorToast: FormAfterActionEffect = {
        formActionType: FormActionType.InvalidSubmit,
        afterEffect: (form: MForm): void => {
            let htmlString: string = (ModulVue.prototype).$i18n
                .translate(
                    'm-form:multipleErrorsToCorrect',
                    { totalNbOfErrors: form.formGroup.errors.length },
                    undefined, undefined, undefined, FormatMode.Sprintf
                );

            (ModulVue.prototype).$toast.show({
                position: MToastPosition.TopCenter,
                state: MToastState.Error,
                text: `<p>${htmlString}</p>`
            });
        }
    };

    public static FocusOnFirstError: FormAfterActionEffect = {
        formActionType: FormActionType.InvalidSubmit,
        afterEffect: (form: MForm): void => {
            form.formGroup.controls.find(c => !c.isValid)!.focusGranted = true;
        }
    };

    public static SummaryMessage: FormAfterActionEffect = {
        formActionType: FormActionType.InvalidSubmit,
        afterEffect: (form: MForm): void => {
            form.displaySummary = true;
        }
    };

    public static ClearSummaryMessage: FormAfterActionEffect = {
        formActionType: FormActionType.ValidSubmitOrReset,
        afterEffect: (form: MForm): void => {
            form.displaySummary = false;
        }
    };
}
