import Vue from 'vue';
import { AbstractControl } from '../../../utils/form/abstract-control';
import { FormArray } from '../../../utils/form/form-array';
import { FormControl } from '../../../utils/form/form-control';
import { FormGroup } from '../../../utils/form/form-group';
import { MForm } from '../form';
import { FormActionFallout } from '../form-action-fallout';
import { FormActions } from '../form-action-type';


const scrollToElement: Function = (element: HTMLElement, offset: number): void => {
    (Vue.prototype).$scrollTo.goTo(element, offset);
};

/**
 * Recursive fonction to return the first formControl in error. If none is returned then the control is return (in case of an error in the formGroup).
 * @param formGroup
 */
const getFirstControlInError: (formGroup: FormGroup | FormArray) => AbstractControl = (formGroup: FormGroup | FormArray): AbstractControl => {
    let invalidControl: AbstractControl | undefined = formGroup.controls.find(c => c.hasError());
    if (invalidControl) {
        if (invalidControl instanceof FormControl) {
            return invalidControl;
        } else {
            return getFirstControlInError(invalidControl as FormGroup | FormArray);
        }
    } else {
        return formGroup;
    }
};

export const ClearErrorToast: FormActionFallout = {
    action: FormActions.ValidSubmitOrResetOrDestroyed,
    fallout: (form: MForm): void => {
        form.displayToast = false;
    }
};

export const ErrorToast: FormActionFallout = {
    action: FormActions.InvalidSubmit,
    fallout: (form: MForm): void => {
        form.displayToast = true;
    }
};

export const FocusOnFirstError: FormActionFallout = {
    action: FormActions.InvalidSubmit,
    fallout: (form: MForm): void => {
        let control: AbstractControl | undefined = getFirstControlInError(form.formGroup);
        if (control) {
            if (control.focusableElement instanceof HTMLInputElement) {
                scrollToElement(control.focusableElement, form.$form.scrollToOffset);
                control.focusableElement.focus();
            } else if (control.focusableElement) {
                scrollToElement(control.focusableElement, form.$form.scrollToOffset);
            }
        }
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
