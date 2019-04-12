import { FormFieldState } from '../form-field-state/form-field-state';
import { FormFieldValidation } from '../form-field-validation/form-field-validation';

/**
 * @see https://wiki.dti.ulaval.ca/pages/viewpage.action?spaceKey=MODUL&title=Gestion+des+erreurs
 */
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

export enum FormFieldEditionContext {
    None = 'none',
    EmptyAndValid = 'empty-and-valid',
    PopulateAndValid = 'populate-and-valid',
    NotValid = 'not-valid'
}

/**
 * Form Field Class
 */
export class FormField<T> {
    private internalValue: T;
    private oldValue: T;
    private internalState: FormFieldState;
    private validationType: FormFieldValidationType = FormFieldValidationType.OnGoing;
    private editionContext: FormFieldEditionContext = FormFieldEditionContext.None;
    private shouldFocusInternal: boolean = false;
    private externalError: string = '';
    private touched: boolean = false;

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

    get isTouched(): boolean {
        return this.touched;
    }

    /**
     * execute validations
     */
    validate(force: boolean = false): void {
        if (!force && !this.validationGuard()) {
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
     * reset the field without validating
     */
    reset(): void {
        this.internalValue = this.accessCallback();
        this.oldValue = this.internalValue;
        this.internalState = new FormFieldState();
        this.externalError = '';
        this.touched = false;
        this.editionContext = FormFieldEditionContext.None;
    }

    initEdition(): void {
        if (!this.internalValue && this.isValid) {
            this.editionContext = FormFieldEditionContext.EmptyAndValid;
        } else if (this.internalValue && this.isValid) {
            this.editionContext = FormFieldEditionContext.PopulateAndValid;
        } else if (!this.isValid) {
            this.editionContext = FormFieldEditionContext.NotValid;
        }
    }

    endEdition(): void {
        this.editionContext = FormFieldEditionContext.None;
        this.validate();
    }

    touch(): void {
        this.touched = true;
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

    private validationGuard(): boolean {
        let shouldValidate: boolean = false;

        if (this.editionContext === FormFieldEditionContext.EmptyAndValid) {
            switch (this.validationType) {
                case FormFieldValidationType.OnGoing:
                    shouldValidate = true;
                    break;
            }
        } else if (this.editionContext === FormFieldEditionContext.PopulateAndValid) {
            switch (this.validationType) {
                case FormFieldValidationType.Optimistic:
                case FormFieldValidationType.OnGoing:
                    shouldValidate = true;
                    break;
            }
        } else if (this.editionContext === FormFieldEditionContext.NotValid) {
            switch (this.validationType) {
                case FormFieldValidationType.Optimistic:
                case FormFieldValidationType.OnGoing:
                case FormFieldValidationType.Correctable:
                    shouldValidate = true;
                    break;
            }
        } else if (this.editionContext === FormFieldEditionContext.None) {
            shouldValidate = true;
        }

        return shouldValidate;
    }
}
