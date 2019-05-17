import { FormActionFallout } from './form-action-fallout';

export class MFormService {
    constructor(
        public readonly formActionFallouts: FormActionFallout[],
        public readonly scrollToOffset: number = -200
    ) { }
}
