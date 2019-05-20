import { AbstractControl } from './abstract-control';
import { ControlOptions } from './control-options';
import { ControlValidator } from './validators/control-validator';

export class FormGroup extends AbstractControl {
    constructor(
        private _controls: { [name: string]: AbstractControl },
        public readonly validators: ControlValidator[] = [],
        options?: ControlOptions
    ) {
        super(validators, options);
        this.setupControlsParent();
    }

    public get value(): any {
        const values: any = { ...this._controls };

        Object.keys(this._controls).map((c: string) => values[c] = this._controls[c].value);

        return values;
    }

    public get valid(): boolean {
        return (
            this.validators.every(v => !!v.lastCheck)
            &&
            this.controls.every(c => c.valid)
        );
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(isEnabled: boolean) {
        this._enabled = isEnabled;
        this.controls.forEach(c => c.enabled = isEnabled);
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

    public get pristine(): boolean {
        return this.controls.some(c => c.pristine);
    }

    public get touched(): boolean {
        return this.controls.every(c => c.touched);
    }

    public hasError(): boolean {
        return (
            this.errors.length > 0
            ||
            this.controls.some(c => c.hasError())
        );
    }

    public async submit(external: boolean = false): Promise<void> {
        this.validate();
        await this.validateAsync();
        await Promise.all(this.controls.map(c => c.submit(external)));
    }

    public reset(): void {
        super.reset();
        this.controls.forEach(c => c.reset());
    }

    public endEdition(): void {
        if (!this.touched) {
            return;
        }

        super.endEdition();
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

        control.parent = this;
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

    private setupControlsParent(): void {
        this.controls.forEach(c => c.parent = this);
    }
}
