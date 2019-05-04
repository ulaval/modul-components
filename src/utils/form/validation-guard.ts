import { ControlEditionContext } from "./control-edition-context";
import { ControlValidatorValidationType } from "./control-validator-validation-type";

export type ControlValidationGuard = (editionContext: ControlEditionContext, validationType: ControlValidatorValidationType, external?: boolean) => boolean;

export const DefaultValidationGuard: ControlValidationGuard = (editionContext: ControlEditionContext, validationType: ControlValidatorValidationType, external?: boolean): boolean => {
    if (external && validationType === ControlValidatorValidationType.External) {
        return false;
    }

    let guard: Map<ControlEditionContext, ControlValidatorValidationType[]> = new Map<ControlEditionContext, ControlValidatorValidationType[]>();

    guard.set(ControlEditionContext.EmptyAndValid, [
        ControlValidatorValidationType.None,
        ControlValidatorValidationType.AtExit,
        ControlValidatorValidationType.Correction,
        ControlValidatorValidationType.Modification,
        ControlValidatorValidationType.External
    ]);
    guard.set(ControlEditionContext.Pristine, [
        ControlValidatorValidationType.None,
        ControlValidatorValidationType.AtExit,
        ControlValidatorValidationType.Correction,
        ControlValidatorValidationType.Modification,
        ControlValidatorValidationType.External
    ]);
    guard.set(ControlEditionContext.PopulateAndValid, [
        ControlValidatorValidationType.None,
        ControlValidatorValidationType.AtExit,
        ControlValidatorValidationType.Correction,
        ControlValidatorValidationType.External
    ]);
    guard.set(ControlEditionContext.HasErrors, [
        ControlValidatorValidationType.None,
        ControlValidatorValidationType.AtExit,
        ControlValidatorValidationType.External
    ]);
    guard.set(ControlEditionContext.None, [
        ControlValidatorValidationType.External
    ]);

    return !!guard.get(editionContext)!.find(vt => vt === validationType);
};
