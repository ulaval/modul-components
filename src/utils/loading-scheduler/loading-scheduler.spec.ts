import LoadingScheduler, { DEFAULT_INVISBLE_THRESHOLD_IN_MILISECONDS, DEFAULT_VISIBLE_THRESHOLD_IN_MILISECONDS } from './loading-scheduler';
import { MLoadingStates } from './loading-states';

describe('loading-scheduler', () => {
    it('should respect invisible and visible thresholds', (done) => {
        let test: any = { state: MLoadingStates.Inactive };

        const scheduler: LoadingScheduler = new LoadingScheduler((state: MLoadingStates) => test.state = state);

        scheduler.start();

        expect(test.state).toBe(MLoadingStates.ActiveInvisible);

        setTimeout(() => {
            expect(test.state).toBe(MLoadingStates.ActiveVisible);

            scheduler.stop();

            expect(test.state).toBe(MLoadingStates.ActiveVisible);

            setTimeout(() => {
                expect(test.state).toBe(MLoadingStates.Inactive);

                done();
            }, DEFAULT_VISIBLE_THRESHOLD_IN_MILISECONDS + 100);

        }, DEFAULT_INVISBLE_THRESHOLD_IN_MILISECONDS + 100);
    });
});
