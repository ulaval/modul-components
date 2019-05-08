import { ControlValidationGuard } from './validation-guard';

export interface ControlOptions {
    validationGuard?: ControlValidationGuard;
}

export interface FormControlOptions<T> extends ControlOptions {
    initialValue?: T;
}
