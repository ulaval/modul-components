import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { MToastPosition, MToastState } from '../toast/toast';
import { MForm } from './form';
import { FormActionFallout } from './form-action-fallout';
import { FormActions } from './form-action-type';


export const ClearErrorToast: FormActionFallout = {
    action: FormActions.ValidSubmitOrResetOrDestroyed,
    fallout: (form: MForm): void => {
        (ModulVue.prototype).$toast.clear();
    }
};

export const ErrorToast: FormActionFallout = {
    action: FormActions.InvalidSubmit,
    fallout: (form: MForm): void => {
        let htmlString: string = (ModulVue.prototype).$i18n
            .translate(
                'm-form:multipleErrorsToCorrect',
                { totalNbOfErrors: form.formGroup.controls.filter(c => c.errors.length > 0).length },
                undefined, undefined, undefined, FormatMode.Sprintf
            );

        (ModulVue.prototype).$toast.show({
            position: MToastPosition.TopCenter,
            state: MToastState.Error,
            text: `<p>${htmlString}</p>`
        });
    }
};

export const FocusOnFirstError: FormActionFallout = {
    action: FormActions.InvalidSubmit,
    fallout: (form: MForm): void => {
        form.formGroup.controls.find(c => !c.isValid)!.focusGranted = true;
    }
};

export const SummaryMessage: FormActionFallout = {
    action: FormActions.InvalidSubmit,
    fallout: (form: MForm): void => {
        form.displaySummary = true;
    }
};

export const ClearSummaryMessage: FormActionFallout = {
    action: FormActions.ValidSubmitOrReset,
    fallout: (form: MForm): void => {
        form.displaySummary = false;
    }
};
