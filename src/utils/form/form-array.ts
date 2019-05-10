import { AbstractControl } from './abstract-control';

export class FormArray extends AbstractControl {

    public isValid: boolean;
    public enabled: boolean;
    public waiting: boolean;
    public readonly: boolean;
    public hasError(): boolean {
        throw new Error('Method not implemented.');
    }
    public initEdition(): void {
        throw new Error('Method not implemented.');
    }

}
