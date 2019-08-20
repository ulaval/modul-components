import { AbstractControl } from './abstract-control';
import { ControlError } from './control-error';
import { ControlValidator } from './validators/control-validator';

export class AbstractControlTest extends AbstractControl {
    constructor(private _controls: {
        [name: string]: AbstractControl;
    }, public readonly validators: ControlValidator[] = []) {
        super(validators);
    }
    public value: any;
    public valid: boolean;
    public enabled: boolean;
    public waiting: boolean;
    public readonly: boolean;
    public touched: boolean;
    public errors: ControlError[];
    public errorsDeep: ControlError[];
    public get controls(): AbstractControl[] {
        return Object.values(this._controls);
    }
    public getControl<T = any>(name: string): AbstractControl<T> {
        throw new Error('Method not implemented.');
    }
    public submit(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
