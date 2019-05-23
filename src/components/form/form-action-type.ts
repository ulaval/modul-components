export enum FormActions {
    None = 1 << 0,
    InvalidSubmit = 1 << 1,
    ValidSubmit = 1 << 2,
    Reset = 1 << 4,
    Created = 1 << 8,
    Updated = 1 << 16,
    Destroyed = 1 << 32,
    ValidSubmitOrReset = ValidSubmit | Reset,
    ValidSubmitOrResetOrDestroyed = ValidSubmit | Reset | Destroyed
}
