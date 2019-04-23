import { MForm } from "./form";
import { FormActionType } from "./form-action-type";

export type FormAfterActionEffect = {
    formActionType: FormActionType,
    afterEffect: (form: MForm) => void;
};
