export enum FormActionType {
    None = 0 << 0,
    InvalidSubmit = 1 << 1,
    ValidSubmit = 2 << 2,
    Reset = 4 << 4,
    Destroy = 8 << 8,
    ValidSubmitOrReset = ValidSubmit | Reset,
    ValidSubmitOrResetOrDestroy = ValidSubmit | Reset | Destroy
}
