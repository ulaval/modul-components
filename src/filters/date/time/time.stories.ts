import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { addDecorator, storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { filtersHierarchyRootSeparator } from '../../../../conf/storybook/utils';
import FrenchPlugin from '../../../lang';
import EnglishPlugin from '../../../lang/en';
import { ENGLISH, FRENCH } from '../../../utils/i18n/i18n';
import { ModulVue } from '../../../utils/vue/vue';
import { TIME_NAME } from './../../filter-names';
import TimeFilterPlugin, { TimeFilterPrepositions } from './time';

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

Vue.use(TimeFilterPlugin);

addDecorator(withKnobs);

function getBaseVueWithLocale(template: string, preposition: {}): any {
    return {
        template,
        props: {
            lang: {
                default: select('language', {
                    [FRENCH]: FRENCH,
                    [ENGLISH]: ENGLISH
                }, ModulVue.prototype.$i18n.currentLang())
            },
            preposition: preposition
        },
        watch: {
            lang: function(): void {
                if (this.lang === FRENCH) {
                    Vue.use(FrenchPlugin);
                }

                if (this.lang === ENGLISH) {
                    Vue.use(EnglishPlugin);
                }

                this.i18n.currentLang(this.lang);
            }
        },
        data: () => ({
            originalLang: (Vue.prototype as ModulVue).$i18n.currentLang(),
            i18n: Vue.prototype.$i18n
        }),
        destroyed(): void {
            ModulVue.prototype.$i18n.currentLang(this.originalLang);
        }
    };
}

function getBaseSimpleVue(template: string): any {
    return getBaseVueWithLocale(template, {
        default: select('preposition', {
            [TimeFilterPrepositions.From]: TimeFilterPrepositions.From,
            [TimeFilterPrepositions.Until]: TimeFilterPrepositions.Until,
            [TimeFilterPrepositions.At]: TimeFilterPrepositions.At,
            [TimeFilterPrepositions.None]: TimeFilterPrepositions.None
        }, TimeFilterPrepositions.None)
    });
}

function getBasePeriodVue(template: string): any {
    return getBaseVueWithLocale(template, {
        default: boolean('withPreposition', false)
    });
}

storiesOf(`${filtersHierarchyRootSeparator}${TIME_NAME}`, module)
    .add('Simple (from strings)', () => getBaseSimpleVue(`
        <div>
            <div>at the top of the hour (AM): {{ '11:00' | f-m-time({ preposition }) }}</div>
            <div>hour with minutes (AM): {{ '11:59' | f-m-time({ preposition }) }}</div>
            <div>at the top of the hour (PM): {{ '14:00' | f-m-time({ preposition }) }}</div>
            <div>hour with minutes (PM): {{ '14:59' | f-m-time({ preposition }) }}</div>
            <div>at the top of the hour (Midnight): {{ '00:00' | f-m-time({ preposition }) }}</div>
            <div>hour with minutes (Midnight): {{ '00:59' | f-m-time({ preposition }) }}</div>
        </div>`)
    )
    .add('Simple (from Dates)', () => getBaseSimpleVue(`
        <div>
            <div>at the top of the hour (AM): {{ new Date('2019-06-23T11:00') | f-m-time({ preposition }) }}</div>
            <div>hour with minutes (AM): {{ new Date('2019-06-23T11:59') | f-m-time({ preposition }) }}</div>
            <div>at the top of the hour (PM): {{ new Date('2019-06-23T14:00') | f-m-time({ preposition }) }}</div>
            <div>hour with minutes (PM): {{ new Date('2019-06-23T14:59') | f-m-time({ preposition }) }}</div>
            <div>at the top of the hour (Midnight): {{ new Date('2019-06-23T00:00') | f-m-time({ preposition }) }}</div>
            <div>hour with minutes (Midnight): {{ new Date('2019-06-23T00:59') | f-m-time({ preposition }) }}</div>
        </div>`)
    )
    .add('Period (from strings)', () => getBasePeriodVue(`
        <div>
            <div>undefined period: {{ undefined | f-m-time-period({ preposition }) }}</div>
            <div>empty period: {{ {} | f-m-time-period({ preposition }) }}</div>
            <div>from only: {{ { from: '11:00' } | f-m-time-period({ preposition }) }}</div>
            <div>to only: {{ { to: '11:59' } | f-m-time-period({ preposition }) }}</div>
            <div>full period: {{ { from: '11:59', to: '14:15' } | f-m-time-period({ preposition }) }}</div>
            <div>full period, same time: {{ { from: '11:59', to: '11:59' } | f-m-time-period({ preposition }) }}</div>
        </div>`)
    )
    .add('Period (from dates)', () => getBasePeriodVue(`
        <div>
            <div>undefined period: {{ undefined | f-m-time-period({ preposition }) }}</div>
            <div>empty period: {{ {} | f-m-time-period({ preposition }) }}</div>
            <div>from only: {{ { from: new Date('2019-06-23T11:00') } | f-m-time-period({ preposition }) }}</div>
            <div>to only: {{ { to: new Date('2019-06-23T11:59') } | f-m-time-period({ preposition }) }}</div>
            <div>full period: {{ { from: new Date('2019-06-23T11:59'), to: new Date('2019-06-23T14:15') } | f-m-time-period({ preposition }) }}</div>
            <div>full period, same time: {{ { from: new Date('2019-06-23T11:59'), to: new Date('2019-06-23T11:59') } | f-m-time-period({ preposition }) }}</div>
        </div>`)
    );
