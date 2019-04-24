import { FormAfterActionEffect } from "./form-after-action-effect";

export class MFormService {
    constructor(public readonly formAfterActionEffects: FormAfterActionEffect[]) { }
}
