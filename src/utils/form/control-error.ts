/**
 * Fields containing the messages to be displayed to the user when an error occurs within a given field.
 */
export interface ControlError {
    /**
     * The message specific to and attached to the field
     */
    message: string | (() => string);
    /**
     * A general error specifying the error and the name of the field affected.
     */
    groupMessage?: string | (() => string);
}
