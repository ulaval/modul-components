import { BehaviorSubject } from 'rxjs';
import { ControlEditionContext } from './control-edition-context';
import { ControlError } from './control-error';
import { ControlOptions, FormControlOptions } from './control-options';
import { ControlValidatorValidationType } from './control-validator-validation-type';
import { ControlValidationGuard, DefaultValidationGuard } from './validation-guard';
import { ControlValidator } from './validators/control-validator';

export abstract class AbstractControl {
    public focusGrantedObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    protected readonly _validationGuard: ControlValidationGuard = DefaultValidationGuard;
    protected _editionContext: ControlEditionContext = ControlEditionContext.None;
    protected _errors: ControlError[] = [];
    protected _waiting: boolean = false;
    protected _enabled: boolean = true;
    protected _readonly: boolean = false;


    constructor(
        public readonly validators: ControlValidator[] = [],
        options?: ControlOptions | FormControlOptions<any>
    ) {
        if (options) {
            if (options.validationGuard) {
                this._validationGuard = options.validationGuard;
            }
        }
    }

    public abstract get isValid(): boolean;
    public abstract get enabled(): boolean;
    public abstract set enabled(isEnabled: boolean);
    public abstract get waiting(): boolean;
    public abstract set waiting(isWaiting: boolean);
    public abstract get readonly(): boolean;
    public abstract set readonly(isReadonly: boolean);
    public abstract hasError(): boolean;

    public get errors(): ControlError[] {
        return this._errors;
    }

    public get errorMessage(): string {
        if (this.hasError()) {
            return this.errors[0].message;
        } else {
            return '';
        }
    }

    public async validate(external: boolean = false): Promise<void> {
        await Promise.all(
            this.validators
                .map(async (v) => {
                    if (this._validationGuard(this._editionContext, v.validationType, external)) {
                        return;
                    }

                    v.lastCheck = await v.validationFunction(this);
                })
        );

        this._updateErrors();
    }

    public reset(): void {
        this.validators.forEach(v => v.lastCheck = undefined);
        this._editionContext = ControlEditionContext.None;
        this._errors = [];
    }

    public abstract initEdition(): void;

    public endEdition(): void {
        this._editionContext = ControlEditionContext.None;
        this._resetManualValidators();
        this.validate();
    }

    protected _resetManualValidators(): void {
        this.validators
            .filter(v => v.validationType === ControlValidatorValidationType.External)
            .forEach(v => {
                v.lastCheck = undefined;
                v.validationFunction = () => undefined;
            });

        this._updateErrors();
    }

    private _updateErrors(): void {
        this._errors = this.validators.filter(v => v.lastCheck === false).map(v => v.error);
    }
}
