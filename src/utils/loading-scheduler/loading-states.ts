export enum MLoadingStates {
    Inactive = 1 << 1,
    ActiveVisible = 1 << 2,
    ActiveInvisible = 1 << 3,
    Active = ActiveVisible | ActiveInvisible
}
