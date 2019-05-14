import { AbstractControl } from './abstract-control';
import { ControlEditionContext } from './control-edition-context';
import { ControlOptions } from './control-options';
import { FormGroup } from './form-group';
import { ControlValidator } from './validators/control-validator';

export class FormArray extends AbstractControl {
    private _validationInterval: any;
    private _editionTimeout: any;

    constructor(
        private _controls: AbstractControl[] = [],
        public readonly validators: ControlValidator[] = [],
        options?: ControlOptions
    ) {
        super(validators, options);
        this.setupControlsParent();
    }

    public get valid(): boolean {
        return this.validators.every(v => !!v.lastCheck) && this._controls.every(c => c.valid);
    }

    public get value(): any {
        return this._controls.map((c: AbstractControl) => c.value);
    }

    public hasError(): boolean {
        return (this.errors.length > 0 || this._controls.some(c => {
            return c.hasError();
        }));
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
        return this._controls;
    }

    public addControl(control: AbstractControl): void {
        control.setParent(this);
        this._controls = this._controls.concat(control);
    }

    public removeControl(index: number): void {
        if (this._controls[index - 1] !== undefined) {
            this._controls = this._controls.slice(index);
        } else {
            throw Error(`There is no control with index= ${index} in this array`);
        }
    }




    public initEdition(): void {
        console.log('FormArray.initEdition');

        if (this.errors.length > 0) {
            this._editionContext = ControlEditionContext.HasErrors;
        } else if (this.pristine) {
            this._editionContext = ControlEditionContext.Pristine;
        } else {
            this._editionContext = ControlEditionContext.Dirty;
        }

        if (this.parent) {
            this.parent.initEdition();
        }
    }

    public endEdition(): void {

        console.log('FormArray.endEdition');
        // only end edition if all field(s) are touched
        if (this.touched) {
            this._editionContext = ControlEditionContext.None;
            this.validate();
            if (this.parent) {
                this.parent.endEdition();
            }
        }

    }

    public updateValidity(): void {
        console.log('FormArray.updateValidity');
        this.validate();

        if (this.parent) {
            this.parent.updateValidity();
        }
    }

    public async validateAllChilds(external: boolean = false): Promise<void> {
        await this.validate();
        await Promise.all(this.controls.map(c => {
            if (c instanceof FormGroup || c instanceof FormArray) {
                return c.validateAllChilds(external);
            } else {
                return c.validate(external);
            }
        }));
    }


    public reset(): void {
        super.reset();
        this._controls.forEach(c => c.reset());
    }

    private setupControlsParent(): void {
        this.controls.forEach(c => c.setParent(this));
    }

}
