import { ModulVue } from '../vue/vue';
import { AbstractControl } from './abstract-control';
import { ControlEditionContext } from './control-edition-context';
import { ControlOptions } from './control-options';
import { FormControl } from './form-control';
import { ControlValidator } from './validators/control-validator';

export class FormGroup extends AbstractControl {
    private _validationInterval: any;
    private _editionTimeout: any;

    constructor(
        private _controls: { [name: string]: AbstractControl },
        public readonly validators: ControlValidator[] = [],
        options?: ControlOptions
    ) {
        super(validators, options);
    }

    public get valid(): boolean {
        return this.validators.every(v => !!v.lastCheck) && this.controls.every(c => c.valid);
    }

    public get value(): any {
        const values: any = { ...this._controls };
        Object.keys(this._controls).map((c: string) => {
            values[c] = this._controls[c].value;
        });
        return values;
    }

    public hasError(): boolean {
        return (this.errors.length > 0 || this.controls.some(c => {
            return c.hasError();
        }));
    }

    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(isEnabled: boolean) {
        this._enabled = isEnabled;
        this.controls.forEach(c => {
            c.enabled = isEnabled;
        });
    }
    public get waiting(): boolean {
        return this._waiting;
    }

    public set waiting(isWaiting: boolean) {
        this._waiting = isWaiting;
        this.controls.forEach(c => c.waiting = isWaiting);
    }

    public get readonly(): boolean {
        return this._readonly;
    }

    public set readonly(isReadonly: boolean) {
        this._readonly = isReadonly;
        this.controls.forEach(c => c.readonly = isReadonly);
    }

    public get controls(): AbstractControl[] {
        return Object.values(this._controls);
    }

    public getControl(name: string): AbstractControl {
        if (this._controls[name] !== undefined) {
            return this._controls[name];
        } else {
            throw Error(`There is no control with the name ${name} in this group`);
        }
    }

    public addControl(name: string, control: AbstractControl): void {

        if (this._controls[name] !== undefined) {
            throw Error(`There is already a control with name ${name} in this group`);
        }
        const result: any = Object.assign(this._controls);
        result[name] = control;
        this._controls = result;
    }

    public removeControl(name: string): void {
        if (this._controls[name] === undefined) {
            throw Error(`There is no control with name ${name} in this group`);
        }
        const result: any = Object.assign(this._controls);
        delete result[name];
        this._controls = result;
    }

    public async validate(external: boolean = false): Promise<void> {
        await super.validate(external);
        await Promise.all(this.controls.map(c => c.validate(external)));
    }

    public initEdition(): void {
        clearInterval(this._validationInterval);
        clearTimeout(this._editionTimeout);

        this._validationInterval = setInterval(
            async () => super.validate()
            , ModulVue.prototype.$form.formGroupValidationIntervalInMilliseconds
        );

        const populate: boolean = !!this.controls
            .filter(c => c instanceof FormControl)
            .find((fc: FormControl<any>) => !!fc.value === true);
        const pristine: boolean = this.controls
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
            this._resetManualValidators();
            super.validate();
        }, ModulVue.prototype.$form.formGroupEditionTimeoutInMilliseconds);
    }

    public reset(): void {
        clearInterval(this._validationInterval);
        clearTimeout(this._editionTimeout);

        super.reset();
        this.controls.forEach(c => c.reset());
    }
}
