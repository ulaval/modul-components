import { ControlEditionContext } from "./control-edition-context";
import { ControlValidationType } from "./control-validation-type";

export type ControlValidationGuard = (editionContext: ControlEditionContext, validationType: ControlValidationType) => boolean;

export const DefaultValidationGuard: ControlValidationGuard = (editionContext: ControlEditionContext, validationType: ControlValidationType): boolean => {
    let guardAgainstValidation: boolean = true;

    if (editionContext === ControlEditionContext.EmptyAndValid) {
        switch (validationType) {
            case ControlValidationType.OnGoing:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === ControlEditionContext.PopulateAndValid) {
        switch (validationType) {
            case ControlValidationType.Modification:
            case ControlValidationType.OnGoing:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === ControlEditionContext.Pristine) {
        switch (validationType) {
            case ControlValidationType.OnGoing:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === ControlEditionContext.HasErrors) {
        switch (validationType) {
            case ControlValidationType.Modification:
            case ControlValidationType.OnGoing:
            case ControlValidationType.Correction:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === ControlEditionContext.None) {
        guardAgainstValidation = false;
    }

    return guardAgainstValidation;
};
