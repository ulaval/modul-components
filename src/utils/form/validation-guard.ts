import { ControlEditionContext } from './control-edition-context';
import { ControlValidatorValidationType } from './control-validator-validation-type';

export type ControlValidationGuard = (editionContext: ControlEditionContext, validationType: ControlValidatorValidationType) => boolean;

export const DefaultValidationGuard: ControlValidationGuard = (editionContext: ControlEditionContext, validationType: ControlValidatorValidationType): boolean => {

    const guard: Map<ControlEditionContext, ControlValidatorValidationType[]> = new Map<ControlEditionContext, ControlValidatorValidationType[]>(
        [
            [
                ControlEditionContext.Pristine, [
                    ControlValidatorValidationType.None,
                    ControlValidatorValidationType.AtExit,
                    ControlValidatorValidationType.Correction,
                    ControlValidatorValidationType.Modification
                ]
            ],
            [
                ControlEditionContext.Dirty, [
                    ControlValidatorValidationType.None,
                    ControlValidatorValidationType.AtExit,
                    ControlValidatorValidationType.Correction
                ]
            ],
            [
                ControlEditionContext.HasErrors, [
                    ControlValidatorValidationType.None,
                    ControlValidatorValidationType.AtExit
                ]
            ],
            [
                ControlEditionContext.None, []
            ]
        ]
    );

    return guard.get(editionContext)!.includes(validationType);
};
