import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { MToastPosition, MToastState } from '../toast/toast';
import { MForm } from './form';
import { FormActionType } from './form-action-type';
import { FormAfterActionEffect } from './form-after-action-effect';

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
