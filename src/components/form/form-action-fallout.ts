import { MForm } from './form';
import { FormActions } from './form-action-type';

export type FormActionFallout = {
    action: FormActions,
    fallout: (form: MForm) => void;
};
