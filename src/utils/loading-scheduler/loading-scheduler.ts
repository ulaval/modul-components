import { MLoadingStates } from './loading-states';

export const DEFAULT_ACTIVE_INVISIBLE_THRESHOLD_IN_MILLISECONDS: number = 300;
export const DEFAULT_ACTIVE_VISIBLE_MIN_DURATION_IN_MILLISECONDS: number = 1000;
export const INTERVAL_STEP_IN_MILLISECONDS: number = 100;

export default class LoadingScheduler {
    private _loadingTimeInMilliseconds: number = 0;
    private _interval: any;

    constructor(
        private _stateTransitionCb: (state: MLoadingStates) => void,
        private _activeInvisibleThresholdInMilliseconds: number = DEFAULT_ACTIVE_INVISIBLE_THRESHOLD_IN_MILLISECONDS,
        private _activeVisibleMinDurationInMilliseconds: number = DEFAULT_ACTIVE_VISIBLE_MIN_DURATION_IN_MILLISECONDS
    ) { }

    public start(): void {
        this._stateTransitionCb(MLoadingStates.ActiveInvisible);

        this._interval = setInterval(() => {
            this._loadingTimeInMilliseconds += INTERVAL_STEP_IN_MILLISECONDS;

            if (this._loadingTimeInMilliseconds >= this._activeInvisibleThresholdInMilliseconds) {
                this._stateTransitionCb(MLoadingStates.ActiveVisible);
            }
        }, INTERVAL_STEP_IN_MILLISECONDS);
    }

    public stop(): void {
        if (
            this._loadingTimeInMilliseconds < this._activeInvisibleThresholdInMilliseconds
            ||
            (
                this._loadingTimeInMilliseconds
                >
                (this._activeInvisibleThresholdInMilliseconds + this._activeVisibleMinDurationInMilliseconds)
            )
        ) {
            this._stateTransitionCb(MLoadingStates.Inactive);
        } else {
            setTimeout(() => this._stateTransitionCb(MLoadingStates.Inactive),
                (this._activeInvisibleThresholdInMilliseconds + this._activeVisibleMinDurationInMilliseconds)
                -
                this._loadingTimeInMilliseconds
            );
        }

        clearInterval(this._interval);
    }
}
