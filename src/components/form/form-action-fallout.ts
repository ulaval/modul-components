import { MForm } from "./form";
import { FormActionType } from "./form-action-type";

export type FormActionFallout = {
    type: FormActionType,
    fallout: (form: MForm) => void;
};
