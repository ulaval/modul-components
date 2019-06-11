import { ControlError } from './control-error';

/**
 * Contains the information related to the error message associated to the failing validations
 */
export class ControlErrorImpl implements ControlError {

    /**
     *
     * @param message The message to show at the control/input level
     * @param groupMessage The message to show at the group level - usually more generic (optionnal)
     */
    constructor(public message: string, public groupMessage?: string) {
        if (groupMessage === undefined) {
            this.groupMessage = '';
        }
    }

    public setMessage(nouveauMessage: string): void {
        this.message = nouveauMessage;
    }

    public setGroupMessage(nouveauGroupMessage: string): void {
        this.groupMessage = nouveauGroupMessage;
    }
}
