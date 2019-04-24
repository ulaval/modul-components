import { FormatMode } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { MToastPosition, MToastState } from '../toast/toast';
import { MForm } from './form';
import { FormActionFallout } from './form-action-fallout';
import { FormActionType } from './form-action-type';


export const ClearErrorToast: FormActionFallout = {
    type: FormActionType.ValidSubmitOrResetOrDestroyed,
    fallout: (form: MForm): void => {
        (ModulVue.prototype).$toast.clear();
    }
};

export const ErrorToast: FormActionFallout = {
    type: FormActionType.InvalidSubmit,
    fallout: (form: MForm): void => {
        let htmlString: string = (ModulVue.prototype).$i18n
            .translate(
                'm-form:multipleErrorsToCorrect',
                { totalNbOfErrors: form.formGroup.controlsErrors.length },
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
    type: FormActionType.InvalidSubmit,
    fallout: (form: MForm): void => {
        form.formGroup.controls.find(c => !c.isValid)!.focusGranted = true;
    }
};

export const SummaryMessage: FormActionFallout = {
    type: FormActionType.InvalidSubmit,
    fallout: (form: MForm): void => {
        form.displaySummary = true;
    }
};

export const ClearSummaryMessage: FormActionFallout = {
    type: FormActionType.ValidSubmitOrReset,
    fallout: (form: MForm): void => {
        form.displaySummary = false;
    }
};
