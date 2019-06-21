import { AbstractControl } from './abstract-control';
import { ControlOptions } from './control-options';
import { ControlValidator } from './validators/control-validator';

export class FormArray extends AbstractControl {
    constructor(
        private _controls: AbstractControl[] = [],
        public readonly validators: ControlValidator[] = [],
        options?: ControlOptions
    ) {
        super(validators, options);

        this.setupControlsParent();
    }

    private setupControlsParent(): void {
        this.controls.forEach(c => c.parent = this);
    }

    /**
     * Return an agregate values of all enabled controls.
     */
    public get value(): any {
        return this._controls.filter(c => c.enabled).map(c => c.value);
    }

    public get valid(): boolean {
        if (!this.enabled || this.readonly) {
            return true;
        } else {
            return (
                this.validators.every(v => !!v.lastCheck)
                &&
                this._controls.every(c => c.valid)
            );
        }
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(isEnabled: boolean) {
        this._enabled = isEnabled;
        this._controls.forEach(c => c.enabled = isEnabled);
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

    public get touched(): boolean {
        return this.controls.every(c => c.touched);
    }

    public async submit(): Promise<void> {
        await Promise.all(this.controls.map(c => c.submit()));

        if (!this._hasAnyControlsInError()) {
            this.validate();
            await this.validateAsync();
        }
    }

    public reset(): void {
        super.reset();
        this._controls.forEach(c => c.reset());
    }

    public initEdition(): void {
        super.initEdition();
    }

    public endEdition(): void {
        if (!this.touched) {
            return;
        }

        super.endEdition();
    }

    public get controls(): AbstractControl[] {
        return this._controls;
    }

    public addControl(control: AbstractControl): void {
        control.parent = this;
        this._controls = this._controls.concat(control);
    }

    public removeControl(index: number): void {
        if (this._controls[index] !== undefined) {
            this._controls.splice(index, 1);
        } else {
            throw Error(`There is no control with index= ${index} in this array`);
        }
    }

    protected _hasAnyControlsInError(): boolean {
        return this.controls.some(c => c.hasError());
    }
}
