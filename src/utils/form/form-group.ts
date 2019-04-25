import { AbstractControl } from "./abstract-control";
import { AbstractControlEditionContext } from "./abstract-control-edition-context";
import { AbstractControlError } from "./abstract-control-error";
import { AbstractControlOptions } from "./abstract-control-options";
import { AbstractControlValidator } from "./abstract-control-validator";
import { FormControl } from "./form-control";

export class FormGroup extends AbstractControl {
    constructor(
        public readonly name: string,
        public readonly validators: AbstractControlValidator[] = [],
        public controls: AbstractControl[],
        options?: AbstractControlOptions
    ) {
        super(name, validators, options);
    }

    public get isValid(): boolean {
        return this.validators.every(v => !!v.lastCheck) && this.controls.every(c => c.isValid);
    }

    public get controlsErrors(): AbstractControlError[] {
        return this.controls
            .map(c => c.errors)
            .reduce((acc, curr) => acc.concat(curr), []);
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
        const populate: boolean = this.controls
            .filter(c => c instanceof FormControl)
            .every((fc: FormControl<any>) => fc.value);
        const pristine: boolean = this.controls
            .filter(c => c instanceof FormControl)
            .every((fc: FormControl<any>) => fc.value === fc['_oldValue'] && fc.value === fc['_initialValue']);

        if (this.errors.length > 0) {
            this._editionContext = AbstractControlEditionContext.HasErrors;
        } else if (pristine) {
            this._editionContext = AbstractControlEditionContext.Pristine;
        } else if (!populate && this.isValid) {
            this._editionContext = AbstractControlEditionContext.EmptyAndValid;
        } else if (populate && this.isValid) {
            this._editionContext = AbstractControlEditionContext.PopulateAndValid;
        }
    }

    public reset(): void {
        super.reset();
        this.controls.forEach(c => c.reset());
    }
}
