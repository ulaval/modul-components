
export interface AbstractControlOptions {
    validationType?: FormControlValidationType;
}

/**
 * @see https://wiki.dti.ulaval.ca/pages/viewpage.action?spaceKey=MODUL&title=Gestion+des+erreurs
 */
export enum FormControlValidationType {
    Optimistic = 'optimistic',
    OnGoing = 'on-going',
    Correctable = 'correctable',
    AtExit = 'at-exit'
}

export enum FormControlEditionContext {
    None = 'none',
    EmptyAndValid = 'empty-and-valid',
    PopulateAndValid = 'populate-and-valid',
    NotValid = 'not-valid'
}

export interface AbstractControlValidator {
    validationFunction: (self: AbstractControl) => boolean;
    lastCheck?: boolean;
    message: string;
    key: string;
}

export abstract class AbstractControl {
    validationType: FormControlValidationType = FormControlValidationType.OnGoing;

    constructor(
        public name: string,
        public validators: AbstractControlValidator[] = []
    ) { }

    public get isValid(): boolean {
        return !!(this.validators.map(v => v.lastCheck).find(lc => lc === false) || true);
    }

    validate(): void {
        this.validators.forEach(v => v.lastCheck = v.validationFunction(this));
    }

    reset(): void {
        this.validators.forEach(v => v.lastCheck = undefined);
    }
}

export class FormGroup extends AbstractControl {
    constructor(
        public name: string,
        public validators: AbstractControlValidator[] = [],
        public controls: AbstractControl[]
    ) {
        super(name, validators);
    }

    getControl(name: string): AbstractControl {
        let control: AbstractControl | undefined = this.controls.find(c => c.name === name);

        if (!control) {
            throw Error(`There is no control with the name ${name} in this group`);
        }

        return control;
    }

    addControl(control: AbstractControl): void {
        if (this.controls.find(c => c.name === control.name)) {
            throw Error(`There is already a control with name ${control.name} in this group`);
        }

        this.controls.push(control);
    }

    removeControl(name: string): void {
        if (this.controls.find(c => c.name === name)) {
            throw Error(`There is no control with name ${name} in this group`);
        }

        this.controls = this.controls.filter(c => c.name === name);
    }

    validate(): void {
        super.validate();
        this.controls.forEach(c => c.validate());
    }

    reset(): void {
        super.reset();
        this.controls.forEach(c => c.reset());
    }
}

export class FormControl<T> extends AbstractControl {
    public editionContext: FormControlEditionContext;

    constructor(
        public name: string,
        public validators: AbstractControlValidator[] = [],
        public value?: T,
        public options?: AbstractControlOptions
    ) {
        super(name, validators);

        if (options) {
            this.validationType = typeof options.validationType === undefined ?
                this.validationType : options.validationType!;
        }
    }

    public get isValid(): boolean {
        return !!this.validators.map(v => v.lastCheck).find(lc => lc === false);
    }

    initEdition(): void {
        if (!this.value && this.isValid) {
            this.editionContext = FormControlEditionContext.EmptyAndValid;
        } else if (this.value && this.isValid) {
            this.editionContext = FormControlEditionContext.PopulateAndValid;
        } else if (!this.isValid) {
            this.editionContext = FormControlEditionContext.NotValid;
        }
    }

    endEdition(): void {
        this.editionContext = FormControlEditionContext.None;
        this.validate();
    }

    reset(): void {
        this.value = undefined;
    }
}

// @Component({
//     template: `
//     <form :id="form.id"
//         @submit.prevent="submit"
//         @reset.prevent="reset">
//       <slot></slot>
//     </form>
//     `
// })
// export class MForm extends ModulVue {
//     @Prop()
//     public formGroup: FormGroup;

//     @Emit('submit')
//     public emitSubmit(): void { }

//     @Emit('reset')
//     public emitReset(): void { }

//     public submit(): void {
//         if (!this.formGroup.isValid) {
//             return;
//         }

//         this.emitSubmit();
//     }

//     public reset(): void {
//         this.formGroup.reset();
//         this.emitReset();
//     }
// }
