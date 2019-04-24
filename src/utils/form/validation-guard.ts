import { AbstractControlEditionContext } from "./abstract-control-edition-context";
import { AbstractControlValidationType } from "./abstract-control-validation-type";

export type AbstractControlValidationGuard = (editionContext: AbstractControlEditionContext, validationType: AbstractControlValidationType) => boolean;

export const DefaultValidationGuard: AbstractControlValidationGuard = (editionContext: AbstractControlEditionContext, validationType: AbstractControlValidationType): boolean => {
    let guardAgainstValidation: boolean = true;

    if (editionContext === AbstractControlEditionContext.EmptyAndValid) {
        switch (validationType) {
            case AbstractControlValidationType.OnGoing:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === AbstractControlEditionContext.PopulateAndValid) {
        switch (validationType) {
            case AbstractControlValidationType.Modification:
            case AbstractControlValidationType.OnGoing:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === AbstractControlEditionContext.Pristine) {
        switch (validationType) {
            case AbstractControlValidationType.Modification:
                guardAgainstValidation = true;
                break;
        }
    } else if (editionContext === AbstractControlEditionContext.HasErrors) {
        switch (validationType) {
            case AbstractControlValidationType.Modification:
            case AbstractControlValidationType.OnGoing:
            case AbstractControlValidationType.Correction:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === AbstractControlEditionContext.None) {
        guardAgainstValidation = false;
    }

    return guardAgainstValidation;
};
