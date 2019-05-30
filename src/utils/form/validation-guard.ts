import { ControlEditionContext } from './control-edition-context';
import { ControlValidatorValidationType } from './control-validator-validation-type';

export type ControlValidationGuard = (editionContext: ControlEditionContext, validationType: ControlValidatorValidationType, external?: boolean) => boolean;

export const DefaultValidationGuard: ControlValidationGuard = (editionContext: ControlEditionContext, validationType: ControlValidatorValidationType, external?: boolean): boolean => {
    if (external && validationType === ControlValidatorValidationType.External) {
        return false;
    }

    const guard: Map<ControlEditionContext, ControlValidatorValidationType[]> = new Map<ControlEditionContext, ControlValidatorValidationType[]>(
        [
            [
                ControlEditionContext.Pristine, [
                    ControlValidatorValidationType.None,
                    ControlValidatorValidationType.AtExit,
                    ControlValidatorValidationType.Correction,
                    ControlValidatorValidationType.Modification,
                    ControlValidatorValidationType.External
                ]
            ],
            [
                ControlEditionContext.Dirty, [
                    ControlValidatorValidationType.None,
                    ControlValidatorValidationType.AtExit,
                    ControlValidatorValidationType.Correction,
                    ControlValidatorValidationType.External
                ]
            ],
            [
                ControlEditionContext.HasErrors, [
                    ControlValidatorValidationType.None,
                    ControlValidatorValidationType.AtExit,
                    ControlValidatorValidationType.External
                ]
            ],
            [
                ControlEditionContext.None, [
                    ControlValidatorValidationType.External
                ]
            ]
        ]
    );

    return guard.get(editionContext)!.includes(validationType);
};
