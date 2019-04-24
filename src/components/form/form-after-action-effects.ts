import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { MToastPosition, MToastState } from '../toast/toast';
import { MForm } from './form';
import { FormActionType } from './form-action-type';
import { FormAfterActionEffect } from './form-after-action-effect';


export const ClearErrorToast: FormAfterActionEffect = {
    formActionType: FormActionType.ValidSubmitOrResetOrDestroyed,
    afterEffect: (form: MForm): void => {
        (ModulVue.prototype).$toast.clear();
    }
};

export const ErrorToast: FormAfterActionEffect = {
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

export const FocusOnFirstError: FormAfterActionEffect = {
    formActionType: FormActionType.InvalidSubmit,
    afterEffect: (form: MForm): void => {
        form.formGroup.controls.find(c => !c.isValid)!.focusGranted = true;
    }
};

export const SummaryMessage: FormAfterActionEffect = {
    formActionType: FormActionType.InvalidSubmit,
    afterEffect: (form: MForm): void => {
        form.displaySummary = true;
    }
};

export const ClearSummaryMessage: FormAfterActionEffect = {
    formActionType: FormActionType.ValidSubmitOrReset,
    afterEffect: (form: MForm): void => {
        form.displaySummary = false;
    }
};
