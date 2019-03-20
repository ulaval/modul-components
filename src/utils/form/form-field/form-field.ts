import { FormFieldState } from '../form-field-state/form-field-state';
import { FormFieldValidation } from '../form-field-validation/form-field-validation';

export enum FormFieldValidationType {
    Optimistic = 'optimistic',
    OnGoing = 'on-going',
    Correctable = 'correctable',
    AtExit = 'at-exit'
}

export interface FormFieldOptions {
    validationType?: FormFieldValidationType;
}

export type FieldValidationCallback<T> = (formField: FormField<T>) => FormFieldValidation;

/**
 * Form Field Class
 * @property {boolean} editing True if value is being updated via edition.
 * @property {boolean} touched True if control has lost focus.
 * @property {boolean} pristine True if user has not interacted with the control yet.
 */
export class FormField<T> {
    private internalValue: T;
    private oldValue: T;
    private internalState: FormFieldState;
    private validationType: FormFieldValidationType = FormFieldValidationType.AtExit;
    private touched: boolean = false;
    private editing: boolean = false;
    private pristine: boolean = true;
    private shouldFocusInternal: boolean = false;
    private externalError: string = '';

    /**
     *
     * @param accessCallback function called to initialize the value of a field
     * @param validationCallback function called to validate
     * @param options options for the field
     */
    constructor(public accessCallback: () => T, public validationCallback: FieldValidationCallback<T>[] = [], options?: FormFieldOptions) {

        this.internalValue = accessCallback();
        this.internalState = new FormFieldState();

        if (options) {
            this.validationType = typeof options.validationType === undefined ?
                this.validationType : options.validationType!;
        }
    }

    /**
     * value of the field
     */
    get value(): T {
        return this.internalValue;
    }

    /**
     * set the value of the field
     */
    set value(newValue: T) {
        this.change(newValue);
    }

    /**
     * indicates if the field has error(s)
     */
    get hasError(): boolean {
        return this.internalState.hasError;
    }

    /**
     * indicates if the field is valid
     */
    get isValid(): boolean {
        return !this.internalState.hasError;
    }

    /**
     * get external error
     */
    get ExternalError(): string {
        return this.externalError;
    }

    /**
     * set external error and trigger validation
     */
    set ExternalError(value: string) {
        this.externalError = value;
        this.validate();
    }

    /**
     * indicates if the field is touched
     */
    get isTouched(): boolean {
        return this.touched;
    }

    /**
     * indicates if the field is being edited
     */
    get isEditing(): boolean {
        return this.editing;
    }

    /**
     * set wheter or not the field is being edited
     */
    set isEditing(value: boolean) {
        this.editing = value;
    }

    /**
     * if the field should focus
     */
    get shouldFocus(): boolean {
        return this.shouldFocusInternal;
    }

    /**
     * set should focus on field
     */
    set shouldFocus(value: boolean) {
        this.shouldFocusInternal = value;
    }

    /**
     * message to show under the form field
     */
    get errorMessage(): string {
        let errorMessageToShow: string = '';

        if (this.hasError) {
            errorMessageToShow = this.internalState.errorMessages[0];
        }

        return errorMessageToShow;
    }

    /**
     * message to show in the error summary
     */
    get errorMessageSummary(): string[] {
        return this.internalState.errorMessagesSummary;
    }

    /**
     * execute validations
     */
    validate(): void {
        if (this.validationCallback.length === 0 || !this.shouldValidate()) {
            return;
        }

        let newState: FormFieldState = new FormFieldState();
        this.validationCallback.forEach((validationFunction) => {
            let validation: FormFieldValidation = validationFunction(this);
            if (validation.isError) {
                newState.hasError = true;
            }
            if (validation.errorMessages.length > 0) {
                newState.errorMessages = newState.errorMessages.concat(validation.errorMessages);
            }
            if (validation.errorMessagesSummary.length > 0) {
                newState.errorMessagesSummary = newState.errorMessagesSummary.concat(validation.errorMessagesSummary);
            }
        });

        this.changeState(newState);
    }

    /**
     * mark the field as touched, reset external error and trigger validation
     */
    touch(): void {
        this.pristine = false;
        this.touched = true;
        this.validate();
        this.touched = false;

        this.externalError = '';
    }

    /**
     * reset the field without validating
     */
    reset(): void {
        this.internalValue = this.accessCallback();
        this.oldValue = this.internalValue;
        this.internalState = new FormFieldState();
        this.externalError = '';
        this.editing = false;
        this.touched = false;
        this.pristine = true;
    }

    /**
     * changes the value and execute validations
     * @param value the new value of the field
     */
    private change(value: T): void {
        if (typeof value === 'object' || value !== this.oldValue) {
            this.oldValue = this.internalValue;
            this.internalValue = value;
            this.validate();
        }
    }

    private changeState(etat: FormFieldState): void {
        this.internalState.hasError = etat.hasError;
        this.internalState.errorMessages = etat.errorMessages;
        this.internalState.errorMessagesSummary = etat.errorMessagesSummary;
    }

    /**
     * @see https://wiki.dti.ulaval.ca/pages/viewpage.action?spaceKey=MODUL&title=Gestion+des+erreurs
     */
    private shouldValidate(): boolean {
        let shouldValidate: boolean = false;

        if (this.pristine) {
            switch (this.validationType) {
                case FormFieldValidationType.Optimistic:
                case FormFieldValidationType.AtExit:
                case FormFieldValidationType.Correctable:
                    shouldValidate = this.touched;
                    break;
                case FormFieldValidationType.OnGoing:
                    shouldValidate = this.editing;
                    break;
            }
        } else if (this.isValid) {
            switch (this.validationType) {
                case FormFieldValidationType.Optimistic:
                case FormFieldValidationType.OnGoing:
                    shouldValidate = this.editing;
                    break;
                case FormFieldValidationType.AtExit:
                case FormFieldValidationType.Correctable:
                    shouldValidate = this.touched;
                    break;
            }
        } else if (!this.isValid) {
            switch (this.validationType) {
                case FormFieldValidationType.Optimistic:
                case FormFieldValidationType.OnGoing:
                case FormFieldValidationType.Correctable:
                    shouldValidate = this.editing;
                    break;
                case FormFieldValidationType.AtExit:
                    shouldValidate = this.touched;
                    break;
            }
        }

        return shouldValidate;
    }
}
