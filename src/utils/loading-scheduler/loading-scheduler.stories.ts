import { number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import ButtonPlugin from '../../components/button/button';
import SpinnerPlugin from '../../components/spinner/spinner';
import LoadingScheduler, { DEFAULT_INVISBLE_THRESHOLD_IN_MILISECONDS, DEFAULT_VISIBLE_THRESHOLD_IN_MILISECONDS } from './loading-scheduler';
import { MLoadingStates } from './loading-states';

Vue.use(SpinnerPlugin);
Vue.use(ButtonPlugin);


storiesOf(`loading-scheduler`, module)
    .add('default', () => ({
        props: {
            invisibleThreshold: {
                default: number('invisible threshold in milliseconds', DEFAULT_INVISBLE_THRESHOLD_IN_MILISECONDS)
            },
            visibleThreshold: {
                default: number('visible threshold in milliseconds', DEFAULT_VISIBLE_THRESHOLD_IN_MILISECONDS)
            }
        },
        data: () => ({
            mLoadingStates: MLoadingStates,
            ressource: {
                loadingState: MLoadingStates.Inactive
            },
            scheduler: LoadingScheduler
        }),
        methods: {
            startLoading(): void {
                (this as any).scheduler = new LoadingScheduler(
                    (state: MLoadingStates) => (this as any).ressource.loadingState = state,
                    (this as any).invisibleThreshold,
                    (this as any).visibleThreshold
                );

                (this as any).scheduler.start();
            },
            stopLoading(): void {
                (this as any).scheduler.stop();
            }
        },
        template: `
        <div>
            <m-spinner v-if="ressource.loadingState === mLoadingStates.ActiveVisible"></m-spinner>
            <m-button @click="startLoading()">Start loading</m-button>
            <m-button @click="stopLoading()">Stop loading</m-button>
        </div>
        `
    }));

