import { ModulVue } from '../vue/vue';
import { AbstractControl } from './abstract-control';
import { ControlEditionContext } from './control-edition-context';
import { ControlOptions } from './control-options';
import { FormControl } from './form-control';
import { ControlValidator } from './validators/control-validator';

export class FormArray extends AbstractControl {
    private _validationInterval: any;
    private _editionTimeout: any;

    constructor(
        private _controls: AbstractControl[],
        public readonly validators: ControlValidator[] = [],
        options?: ControlOptions
    ) {
        super(validators, options);
    }

    public get value(): any {
        return this._controls.map((c: AbstractControl) => c.value);
    }

    public get valid(): boolean {
        return this.validators.every(v => !!v.lastCheck) && this._controls.every(c => c.valid);
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(isEnabled: boolean) {
        this._enabled = isEnabled;
        this._controls.forEach(c => {
            c.enabled = isEnabled;
        });
    }

    public get waiting(): boolean {
        return this._waiting;
    }

    public set waiting(isWaiting: boolean) {
        this._waiting = isWaiting;
        this._controls.forEach(c => c.waiting = isWaiting);
    }


    public get readonly(): boolean {
        return this._readonly;
    }

    public set readonly(isReadonly: boolean) {
        this._readonly = isReadonly;
        this._controls.forEach(c => c.readonly = isReadonly);
    }

    public hasError(): boolean {
        return (this.errors.length > 0 || this._controls.some(c => {
            return c.hasError();
        }));
    }

    public get controls(): AbstractControl[] {
        return this._controls;
    }

    public addControl(control: AbstractControl): void {
        this._controls = this._controls.concat(control);
    }

    public removeControl(index: number): void {
        if (this._controls[index - 1] !== undefined) {
            this._controls = this._controls.slice(index);
        } else {
            throw Error(`There is no control with index= ${index} in this array`);
        }
    }

    public async validate(external: boolean = false): Promise<void> {
        await super.validate(external);
        await Promise.all(this._controls.map(c => c.validate(external)));
    }

    public reset(): void {
        clearInterval(this._validationInterval);
        clearTimeout(this._editionTimeout);

        super.reset();
        this._controls.forEach(c => c.reset());
    }

    public initEdition(): void {
        clearInterval(this._validationInterval);
        clearTimeout(this._editionTimeout);

        this._validationInterval = setInterval(
            async () => super.validate()
            , ModulVue.prototype.$form.formGroupValidationIntervalInMilliseconds
        );

        const populate: boolean = !!this._controls
            .filter(c => c instanceof FormControl)
            .find((fc: FormControl<any>) => !!fc.value === true);
        const pristine: boolean = this._controls
            .filter(c => c instanceof FormControl)
            .every((fc: FormControl<any>) => fc.value === fc['_oldValue'] && fc.value === fc['_initialValue']);
        const isValid: boolean = this.validators.every(v => !!v.lastCheck);

        if (this.errors.length > 0) {
            this._editionContext = ControlEditionContext.HasErrors;
        } else if (pristine) {
            this._editionContext = ControlEditionContext.Pristine;
        } else if (!populate && isValid) {
            this._editionContext = ControlEditionContext.EmptyAndValid;
        } else if (populate && isValid) {
            this._editionContext = ControlEditionContext.PopulateAndValid;
        }
    }

    public endEdition(): void {
        this._editionTimeout = setTimeout(() => {
            clearInterval(this._validationInterval);
            clearTimeout(this._editionTimeout);

            this._editionContext = ControlEditionContext.None;
            this._resetExternalValidators();
            super.validate();
        }, ModulVue.prototype.$form.formGroupEditionTimeoutInMilliseconds);
    }
}
