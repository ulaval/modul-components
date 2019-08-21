import { MLoadingStates } from './loading-states';

export const DEFAULT_INVISBLE_THRESHOLD_IN_MILISECONDS: number = 300;
export const DEFAULT_VISIBLE_THRESHOLD_IN_MILISECONDS: number = 1000;
export const INTERVAL_STEP_IN_MILLISECONDS: number = 100;

export default class LoadingScheduler {
    private _loadingTimeInMilliseconds: number = 0;
    private _interval: number;

    constructor(
        private _stateTransitionCb: (state: MLoadingStates) => void,
        private _invisibleThresholdInMiliseconds: number = DEFAULT_INVISBLE_THRESHOLD_IN_MILISECONDS,
        private _visibleThresholdInMiliseconds: number = DEFAULT_VISIBLE_THRESHOLD_IN_MILISECONDS
    ) { }

    public start(): void {
        this._stateTransitionCb(MLoadingStates.ActiveInvisible);

        this._interval = window.setInterval(() => {
            this._loadingTimeInMilliseconds += INTERVAL_STEP_IN_MILLISECONDS;

            if (this._loadingTimeInMilliseconds >= this._invisibleThresholdInMiliseconds) {
                this._stateTransitionCb(MLoadingStates.ActiveVisible);
            }
        }, INTERVAL_STEP_IN_MILLISECONDS);
    }

    public stop(): void {
        if (
            this._loadingTimeInMilliseconds < this._invisibleThresholdInMiliseconds
            ||
            (
                this._loadingTimeInMilliseconds
                >
                (this._invisibleThresholdInMiliseconds + this._visibleThresholdInMiliseconds)
            )
        ) {
            this._stateTransitionCb(MLoadingStates.Inactive);
        } else {
            window.setTimeout(() => this._stateTransitionCb(MLoadingStates.Inactive),
                (this._invisibleThresholdInMiliseconds + this._visibleThresholdInMiliseconds)
                -
                this._loadingTimeInMilliseconds
            );
        }

        clearInterval(this._interval);
    }
}
