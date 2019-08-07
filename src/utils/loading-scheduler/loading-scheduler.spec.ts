import LoadingScheduler, { DEFAULT_ACTIVE_INVISIBLE_THRESHOLD_IN_MILLISECONDS, DEFAULT_ACTIVE_VISIBLE_MIN_DURATION_IN_MILLISECONDS } from './loading-scheduler';
import { MLoadingStates } from './loading-states';

describe('laoding-scheduler', () => {
    it('', (done) => {
        let test: any = { state: MLoadingStates.Inactive };

        const scheduler: LoadingScheduler = new LoadingScheduler((state: MLoadingStates) => {
            test.state = state;
        });

        scheduler.start();

        expect(test.state).toBe(MLoadingStates.ActiveInvisible);

        setTimeout(() => {
            expect(test.state).toBe(MLoadingStates.ActiveVisible);

            scheduler.stop();

            expect(test.state).toBe(MLoadingStates.ActiveVisible);

            setTimeout(() => {
                expect(test.state).toBe(MLoadingStates.Inactive);

                done();
            }, DEFAULT_ACTIVE_VISIBLE_MIN_DURATION_IN_MILLISECONDS + 1);

        }, DEFAULT_ACTIVE_INVISIBLE_THRESHOLD_IN_MILLISECONDS + 1);
    });
});
