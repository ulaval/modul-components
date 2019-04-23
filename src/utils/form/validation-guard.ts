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
            case AbstractControlValidationType.Optimistic:
            case AbstractControlValidationType.OnGoing:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === AbstractControlEditionContext.NotValid) {
        switch (validationType) {
            case AbstractControlValidationType.Optimistic:
            case AbstractControlValidationType.OnGoing:
            case AbstractControlValidationType.Correctable:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === AbstractControlEditionContext.None) {
        guardAgainstValidation = false;
    }

    return guardAgainstValidation;
};
