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
 * Recursive fonction to return the first formControl in error. If none is returned then undefined is returned (in case of an error in the formGroup).
 * @param formGroup
 */
const getFirstControlInError: (formGroup: FormGroup | FormArray) => AbstractControl | undefined = (formGroup: FormGroup | FormArray): AbstractControl | undefined => {
    let invalidControl: AbstractControl | undefined;

    let controls: AbstractControl[] = formGroup.controls;
    if (controls && controls.length > 0) {
        for (let index: number = 0; index < controls.length; ++index) {
            if (controls[index] instanceof FormControl) {
                if (controls[index].hasError()) {
                    return controls[index];
                }
            } else {
                let invalidControlInGroup: AbstractControl | undefined = getFirstControlInError(controls[index] as FormGroup | FormArray);
                if (invalidControlInGroup) {
                    return invalidControlInGroup;
                }
            }
        }
    }

    return invalidControl;
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
            if (control.htmlElement instanceof HTMLInputElement || control.htmlElement instanceof HTMLTextAreaElement) {
                scrollToElement(control.htmlElement, form.$form.scrollToOffset);
                control.htmlElement.focus();
            } else if (control.htmlElement) {
                scrollToElement(control.htmlElement, form.$form.scrollToOffset);
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
