import { FormFieldState } from '../form-field-state/form-field-state';
import { FormFieldValidation } from '../form-field-validation/form-field-validation';

export interface FormFieldOptions {
    messageAfterTouched?: boolean;
}

export type FieldValidationCallback<T> = (formField: FormField<T>) => FormFieldValidation;
/**
 * Form Field Class
 */
export class FormField<T> {
    private internalValue: T;
    private oldValue: T;
    private internalState: FormFieldState;
    private messageAfterTouched: boolean = true;
    private touched: boolean = false;
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
            this.messageAfterTouched = typeof options.messageAfterTouched === undefined ?
                this.messageAfterTouched : options.messageAfterTouched!;
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

        if (this.hasError && ((this.messageAfterTouched && this.touched) || !this.messageAfterTouched)) {
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
        if (this.validationCallback.length > 0) {
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
    }

    /**
     * mark the field as touched, reset external error and trigger validation
     */
    touch(): void {
        this.touched = true;
        this.externalError = '';
        this.validate();
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
    }

    /**
     * changes the value and execute validations
     * @param value the new value of the field
     */
    private change(value: T): void {
        if (typeof value === 'object' || value !== this.oldValue) {
            this.internalValue = value;
            this.oldValue = this.internalValue;
            this.validate();
        }
    }

    private changeState(etat: FormFieldState): void {
        this.internalState.hasError = etat.hasError;
        this.internalState.errorMessages = etat.errorMessages;
        this.internalState.errorMessagesSummary = etat.errorMessagesSummary;
    }
}
