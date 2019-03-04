import { Subject } from 'rxjs';
import uuid from '../uuid/uuid';
import { FormField } from './form-field/form-field';
import { FormState } from './form-state/form-state';
import { FormValidation } from './form-validation/form-validation';
export type FormValidationCallback = (formInstance: Form) => FormValidation;
export type FormFieldGroup = { [name: string]: FormField<any>; };
export type FormChange = { field: string, value: any };

/**
 * Form Class
 */
export class Form {
    public id: string;
    private internalState: FormState;
    private changeObservable: Subject<FormChange> = new Subject();

    /**
     *
     * @param fieldGroup the group of field that populate the form
     * @param validationCallbacks a list of function to call to verify the form's state
     */
    constructor(private fieldGroup: FormFieldGroup, private validationCallbacks: FormValidationCallback[] = []) {
        this.id = uuid.generate();
        this.internalState = new FormState();
        this.observeFieldChanges();
    }

    /**
     * return change observable
     */
    get Changes(): Subject<FormChange> {
        return this.changeObservable;
    }

    /**
     * return the form fields
     */
    get fields(): FormField<any>[] {
        return Object.keys(this.fieldGroup)
            .map((name: string): FormField<any> => this.fieldGroup[name]);
    }

    /**
     * Total number of errors
     */
    get totalNbOfErrors(): number {
        return this.nbFieldsThatHasError + this.nbOfErrors;
    }

    /**
     * Number of fields that have errors
     */
    get nbFieldsThatHasError(): number {
        return this.fields.filter((field: FormField<any>) => field.hasError).length;
    }

    /**
     * Number of form errors
     */
    get nbOfErrors(): number {
        return this.internalState.errorMessages.length;
    }

    /**
     * return true if the form contains no field with errors
     */
    get isValid(): boolean {
        return this.nbFieldsThatHasError === 0 && this.nbOfErrors === 0;
    }

    /**
     * return the field's name
     */
    getFieldName(formField: FormField<any>): string {
        return Object.keys(this.fieldGroup).find((name: string) => this.fieldGroup[name] === formField)!;
    }

    /**
     * Return the formField with the coresponding name
     *
     * @param formFieldName the name of the formfield to access
     */
    get(formFieldName: string): FormField<any> {
        let formField: FormField<any> = this.fieldGroup[formFieldName];

        if (!formField) {
            throw new Error('Trying to access an non existing form field');
        }

        return this.fieldGroup[formFieldName];
    }

    /**
     * reset all fields in the form without validating
     */
    reset(): void {
        this.fields.forEach((field: FormField<any>) => {
            field.reset();
        });

        this.internalState = new FormState();
    }

    /**
     * returns all the messages that must be shown in the summary
     */
    getErrorsForSummary(): string[] {
        let errorsSummary: string[] = [];

        this.internalState.errorMessages.forEach((message: string) => {
            errorsSummary.push(message);
        });

        this.fields.forEach((field: FormField<any>) => {
            errorsSummary.push(field.errorMessageSummary[0]);
        });

        return errorsSummary;
    }

    focusFirstFieldWithError(): void {
        let fieldWithError: FormField<any> | undefined = this.fields.find(field => {
            return field.hasError;
        });

        if (fieldWithError) {
            fieldWithError.shouldFocus = true;
        }
    }


    /**
     * validate all fields in the form
     */
    validateAll(): void {
        this.fields.forEach((field: FormField<any>) => {
            field.touch();
        });

        this.internalState = new FormState();
        this.validationCallbacks.forEach((validationCallback: FormValidationCallback) => {
            this.changeState(validationCallback(this));
        });
    }

    private changeState(formValidation: FormValidation): void {
        if (!formValidation.hasError) {
            return;
        }

        this.internalState.hasErrors = true;
        this.internalState.errorMessages = this.internalState.errorMessages.concat(formValidation.errorMessage);
    }

    private observeFieldChanges(): void {
        this.fields.forEach((formField: FormField<any>) => {
            formField.Changes.subscribe((value: any) => {
                let change: FormChange = { field: this.getFieldName(formField), value };
                this.changeObservable.next(change);
            });
        });
    }

}
