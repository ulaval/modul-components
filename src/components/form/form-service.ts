import { FormActionFallout } from "./form-action-fallout";

export class MFormService {
    constructor(
        public readonly formActionFallouts: FormActionFallout[],
        public readonly formGroupEditionValidationIntervalInMilliseconds: number = 500,
        public readonly formGroupEditionTimeoutInMilliseconds: number = 700
    ) { }
}
