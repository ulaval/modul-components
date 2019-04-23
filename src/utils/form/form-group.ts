import { AbstractControl, AbstractControlEditionContext, AbstractControlError, AbstractControlValidationType, AbstractControlValidator } from "./abstract-control";
import { FormControl } from "./form-control";

export class FormGroup extends AbstractControl {
    constructor(
        public readonly name: string,
        public readonly validators: AbstractControlValidator[] = [],
        public readonly validationType: AbstractControlValidationType = AbstractControlValidationType.OnGoing,
        public controls: AbstractControl[]
    ) {
        super(name, validators, validationType);
    }

    public get isValid(): boolean {
        return this.validators.every(v => !!v.lastCheck) && this.controls.every(c => c.isValid);
    }

    public get errors(): AbstractControlError[] {
        return this.controls
            .map(c => c.errors)
            .reduce((acc, curr) => acc.concat(curr), [])
            .concat(this._errors);
    }

    public getControl(name: string): AbstractControl {
        let control: AbstractControl | undefined = this.controls.find(c => c.name === name);

        if (!control) {
            throw Error(`There is no control with the name ${name} in this group`);
        }

        return control;
    }

    public addControl(control: AbstractControl): void {
        if (this.controls.find(c => c.name === control.name)) {
            throw Error(`There is already a control with name ${control.name} in this group`);
        }

        this.controls.push(control);
    }

    public removeControl(name: string): void {
        if (this.controls.find(c => c.name === name)) {
            throw Error(`There is no control with name ${name} in this group`);
        }

        this.controls = this.controls.filter(c => c.name === name);
    }

    public validate(): void {
        super.validate();
        this.controls.forEach(c => c.validate());
    }

    public initEdition(): void {
        if (
            !this.controls.filter(c => c instanceof FormControl).every((fc: FormControl<any>) => !!fc.value)
            &&
            this.isValid
        ) {
            this.editionContext = AbstractControlEditionContext.EmptyAndValid;
        } else if (
            this.controls.filter(c => c instanceof FormControl).every((fc: FormControl<any>) => !!fc.value)
            &&
            this.isValid
        ) {
            this.editionContext = AbstractControlEditionContext.PopulateAndValid;
        } else if (!this.isValid) {
            this.editionContext = AbstractControlEditionContext.NotValid;
        }
    }

    public reset(): void {
        super.reset();
        this.controls.forEach(c => c.reset());
    }

    protected preventValidation(): boolean {
        return false;
    }
}