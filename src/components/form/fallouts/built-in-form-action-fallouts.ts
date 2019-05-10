import { AbstractControl } from '../../../utils/form/abstract-control';
import { ControlValidatorValidationType } from '../../../utils/form/control-validator-validation-type';
import { FormatMode } from '../../../utils/i18n/i18n';
import { ModulVue } from '../../../utils/vue/vue';
import { MToastPosition, MToastState } from '../../toast/toast';
import { MForm } from '../form';
import { FormActionFallout } from '../form-action-fallout';
import { FormActions } from '../form-action-type';


export const ClearErrorToast: FormActionFallout = {
    action: FormActions.ValidSubmitOrResetOrDestroyed,
    fallout: (): void => {
        (ModulVue.prototype).$toast.clear();
    }
};

export const ErrorToast: FormActionFallout = {
    action: FormActions.InvalidSubmit,
    fallout: (form: MForm): void => {
        const formControlErrorsCount: number = Object.values(form.formGroup.controls).filter(c => c.errors.length > 0).length;
        const formGroupErrorsCount: number = form.formGroup.errors.length;
        const message: string = (ModulVue.prototype).$i18n
            .translate(
                'm-form:multipleErrorsToCorrect',
                { totalNbOfErrors: formControlErrorsCount + formGroupErrorsCount },
                undefined, undefined, undefined, FormatMode.Sprintf
            );

        (ModulVue.prototype).$toast.show({
            position: MToastPosition.TopCenter,
            state: MToastState.Error,
            text: `<p>${message}</p>`
        });
    }
};

export const FocusOnFirstError: FormActionFallout = {
    action: FormActions.InvalidSubmit,
    fallout: (form: MForm): void => {
        let control: AbstractControl | undefined = Object.values(form.formGroup.controls).find(c => !c.isValid);

        if (control) {
            control.focusGrantedObservable.next(true);
            return;
        }

        control = Object.values(form.formGroup.controls)
            .find(c =>
                !!c.validators.find(v => v.validationType === ControlValidatorValidationType.External && !v.lastCheck)
            );

        if (control) {
            control.focusGrantedObservable.next(true);
            return;
        }

        form.formGroup.focusGrantedObservable.next(true);
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
