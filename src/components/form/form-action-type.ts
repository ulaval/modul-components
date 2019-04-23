export enum FormActionType {
    None = 0 << 0,
    InvalidSubmit = 1 << 1,
    ValidSubmit = 2 << 2,
    Reset = 4 << 4,
    Created = 8 << 8,
    Updated = 16 << 16,
    Destroyed = 32 << 32,
    ValidSubmitOrReset = ValidSubmit | Reset,
    ValidSubmitOrResetOrDestroyed = ValidSubmit | Reset | Destroyed
}
