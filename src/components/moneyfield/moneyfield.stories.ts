import { select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ENGLISH, FRENCH } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { MONEYFIELD_NAME } from './../component-names';
import { MMoneyfield } from './moneyfield';

storiesOf(`${componentsHierarchyRootSeparator}${MONEYFIELD_NAME}`, module)

    .add('Basic', () => ({
        components: { MMoneyfield },
        template: `
            <div>
                <div><${MONEYFIELD_NAME} v-model="value"></${MONEYFIELD_NAME}></div>
                <div><${MONEYFIELD_NAME} v-model="value" :label="'Label'"></${MONEYFIELD_NAME}></div>
                <div><${MONEYFIELD_NAME} v-model="value" :label="'Required label'" :required-marker="true"></${MONEYFIELD_NAME}></div>
                <div><${MONEYFIELD_NAME} v-model="value" :valid-message="'Valid message'"></${MONEYFIELD_NAME}></div>
                <div><${MONEYFIELD_NAME} v-model="value" :helper-message="'Helper message'"></${MONEYFIELD_NAME}></div>
                <div><${MONEYFIELD_NAME} v-model="value" :error-message="'Error message'"></${MONEYFIELD_NAME}></div>
            </div>
        `,
        data: () => ({
            value: undefined
        })
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MONEYFIELD_NAME}`, module)

    .add('States', () => ({
        components: { MMoneyfield },
        template: `
            <div>
                <div><${MONEYFIELD_NAME} v-model="value" :disabled="true" :placeholder="'Disabled'"></${MONEYFIELD_NAME}></div>
                <div><${MONEYFIELD_NAME} v-model="value" :placeholder="'Read-only'" :readonly="true"></${MONEYFIELD_NAME}></div>
                <div><${MONEYFIELD_NAME} v-model="value" label="label bla label" :placeholder="'Waiting'" :waiting="true"></${MONEYFIELD_NAME}></div>
            </div>
        `,
        data: () => ({
            value: undefined
        })
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MONEYFIELD_NAME}`, module)

    .add('With initial value (0)', () => ({
        components: { MMoneyfield },
        template: `<${MONEYFIELD_NAME} v-model="value"></${MONEYFIELD_NAME}>`,
        data: () => ({
            value: 0
        })
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MONEYFIELD_NAME}`, module)

    .add('With initial value', () => ({
        components: { MMoneyfield },
        template: `<${MONEYFIELD_NAME} v-model="value"></${MONEYFIELD_NAME}>`,
        data: () => ({
            value: 123456.7
        })
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MONEYFIELD_NAME}`, module)

    .add('Localization', () => ({
        components: { MMoneyfield },
        template: `
            <${MONEYFIELD_NAME} v-model="value"></${MONEYFIELD_NAME}>
        `,
        props: {
            lang: {
                default: select('Language', {
                    [FRENCH]: FRENCH,
                    [ENGLISH]: ENGLISH
                }, (Vue.prototype as ModulVue).$i18n.currentLang())
            }
        },
        watch: {
            lang: function(): void {
                this.i18n.currentLang(this.lang);
            }
        },
        data: () => ({
            value: 123456.7,
            originalLang: (Vue.prototype as ModulVue).$i18n.currentLang(),
            i18n: Vue.prototype.$i18n
        }),
        destroyed(): void {
            (Vue.prototype as ModulVue).$i18n.currentLang(this.originalLang);
        }
    }));

// storiesOf(`${componentsHierarchyRootSeparator}${MONEYFIELD_NAME}`, module)
//
//     .add('Format', () => ({
//         components: { MMoneyfield },
//         template: `<div>
//                 <${MONEYFIELD_NAME} v-model="value"></${MONEYFIELD_NAME}>
//                 => {{ formatedOuput }}
//             </div>
//         `,
//         props: {
//             lang: {
//                 default: select('Language', {
//                     [FRENCH]: FRENCH,
//                     [ENGLISH]: ENGLISH
//                 }, (Vue.prototype as ModulVue).$i18n.currentLang())
//             },
//             stripDecimalZeroes: {
//                 default: boolean('Strip decimal zeroes', false)
//             }
//         },
//         watch: {
//             lang: function(): void {
//                 this.i18n.currentLang(this.lang);
//             }
//         },
//         computed: {
//             formatedOuput(): string {
//                 return formatCurrencyWithOptions(this.value, {
//                     currency: (Vue.prototype as ModulVue).$l10n.currentCurrency,
//                     stripDecimalZeroes: this.stripDecimalZeroes
//                 });
//             }
//         },
//         data: () => ({
//             value: 123456.7,
//             originalLang: (Vue.prototype as ModulVue).$i18n.currentLang(),
//             i18n: Vue.prototype.$i18n,
//             l10n: Vue.prototype.$l10n
//         }),
//         destroyed(): void {
//             (Vue.prototype as ModulVue).$i18n.currentLang(this.originalLang);
//         }
//     }));

storiesOf(`${componentsHierarchyRootSeparator}${MONEYFIELD_NAME}`, module)

    .add('Default precision', () => ({
        components: { MMoneyfield },
        template: `
            <${MONEYFIELD_NAME} v-model="value"></${MONEYFIELD_NAME}>
        `,
        data: () => ({
            value: 999999999.99
        })
    }))
    .add('Custom precision', () => ({
        components: { MMoneyfield },
        template: `
            <${MONEYFIELD_NAME} v-model="value" :precision="7"></${MONEYFIELD_NAME}>
        `,
        data: () => ({
            value: 99999.99
        })
    }));
