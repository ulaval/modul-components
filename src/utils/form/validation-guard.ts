import { ControlEditionContext } from "./control-edition-context";
import { ControlValidatorValidationType } from "./control-validator-validation-type";

export type ControlValidationGuard = (editionContext: ControlEditionContext, validationType: ControlValidatorValidationType, manualy?: boolean) => boolean;

export const DefaultValidationGuard: ControlValidationGuard = (editionContext: ControlEditionContext, validationType: ControlValidatorValidationType, manualy?: boolean): boolean => {
    if (manualy && validationType === ControlValidatorValidationType.Manual) {
        return false;
    }

    let guardAgainstValidation: boolean = true;

    if (editionContext === ControlEditionContext.EmptyAndValid ||
        editionContext === ControlEditionContext.Pristine) {
        switch (validationType) {
            case ControlValidatorValidationType.OnGoing:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === ControlEditionContext.PopulateAndValid) {
        switch (validationType) {
            case ControlValidatorValidationType.Modification:
            case ControlValidatorValidationType.OnGoing:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === ControlEditionContext.HasErrors) {
        switch (validationType) {
            case ControlValidatorValidationType.Modification:
            case ControlValidatorValidationType.OnGoing:
            case ControlValidatorValidationType.Correction:
                guardAgainstValidation = false;
                break;
        }
    } else if (editionContext === ControlEditionContext.None) {
        switch (validationType) {
            case ControlValidatorValidationType.Modification:
            case ControlValidatorValidationType.OnGoing:
            case ControlValidatorValidationType.Correction:
            case ControlValidatorValidationType.AtExit:
            case ControlValidatorValidationType.None:
                guardAgainstValidation = false;
                break;
        }
    }

    return guardAgainstValidation;
};
