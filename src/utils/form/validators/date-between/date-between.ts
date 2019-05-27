import { dateFilter } from '../../../../filters/date/date/date';
import { FormatMode } from '../../../i18n/i18n';
import ModulDate from '../../../modul-date/modul-date';
import { ModulVue } from '../../../vue/vue';
import { ControlValidatorValidationType } from '../../control-validator-validation-type';
import { FormControl } from '../../form-control';
import { FormGroup } from '../../form-group';
import { ControlValidator, ControlValidatorOptions } from '../control-validator';
import { ValidatorKeys } from '../validator-error-keys';


export const DateBetweenValidator: Function = (controlLabel: string, start: string, end: string, options: ControlValidatorOptions): ControlValidator => {

    const startFormatted: string = dateFilter(new ModulDate(start).toDate());
    const endFormatted: string = dateFilter(new ModulDate(end).toDate());

    return {
        key: ValidatorKeys.Date,
        validationFunction: (control: FormControl<any>): boolean => {
            if (control instanceof FormGroup) {
                throw Error('the DateBetweenValidator should not be attached to a form group');
            }

            if (!control.value || (control.value.length < 10) || isNaN(Date.parse(control.value))) {
                return true;
            } else {
                const formControlDate: ModulDate = new ModulDate(control.value);
                return formControlDate.isBetween(new ModulDate(start), new ModulDate(end));
            }

        },
        error: options && options.error ?
            options.error : {
                message: (ModulVue.prototype.$i18n).translate(
                    'm-form:dateBetweenValidatorErrorMessage',
                    {
                        controlLabel,
                        start: startFormatted,
                        end: endFormatted
                    },
                    undefined, undefined, undefined, FormatMode.Sprintf
                ),
                groupMessage: (ModulVue.prototype.$i18n).translate(
                    'm-form:dateBetweenValidatorErrorSummaryMessage',
                    {
                        controlLabel,
                        start: startFormatted,
                        end: endFormatted
                    },
                    undefined, undefined, undefined, FormatMode.Sprintf
                )
            },
        validationType: options && options.validationType ?
            options.validationType : ControlValidatorValidationType.Correction
    };
};
