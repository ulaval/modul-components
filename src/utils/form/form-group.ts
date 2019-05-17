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

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(isEnabled: boolean) {
        this._enabled = isEnabled;
        this.controls.forEach(c => {
            c.enabled = isEnabled;
        });
    }

    public hasError(): boolean {
        return (this.errors.length > 0 || this.controls.some(c => {
            return c.hasError();
        }));
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

    /**
     * A form group is considered pristine if at least one field is pristine
     */
    public get pristine(): boolean {
        return this.controls.some(c => {
            return c.pristine;
        });
    }

    /**
     * A form group is considrered touched when every fields on the group are touched
     */
    public get touched(): boolean {
        return this.controls.every(c => {
            return c.touched;
        });
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
        result[name].setParent(this);
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

    public endEdition(): void {
        if (this.touched) {
            super.endEdition();
        }
    }

    public async submit(external: boolean = false): Promise<void> {
        this.validate();
        await this.validateAsync();
        await Promise.all(this.controls.map(c => {
            return c.submit(external);
        }));
    }

    public reset(): void {
        super.reset();
        this.controls.forEach(c => c.reset());
    }

    private setupControlsParent(): void {
        this.controls.forEach(c => c.setParent(this));
    }


}
