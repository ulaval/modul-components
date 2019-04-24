import { withA11y } from '@storybook/addon-a11y';
import { select, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { ENGLISH, FRENCH } from '../../utils/i18n/i18n';
import { ModulVue } from '../../utils/vue/vue';
import { DECIMALFIELD_NAME } from '../component-names';
import { MDecimalfield } from './decimalfield';

storiesOf(`${componentsHierarchyRootSeparator}${DECIMALFIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('Basic', () => ({
        components: { MDecimalfield },
        template: `
            <div>
                <div><${DECIMALFIELD_NAME} v-model="value"></${DECIMALFIELD_NAME}></div>
                <div><${DECIMALFIELD_NAME} v-model="value" :label="'Label'"></${DECIMALFIELD_NAME}></div>
                <div><${DECIMALFIELD_NAME} v-model="value" :label="'Required label'" :required-marker="true"></${DECIMALFIELD_NAME}></div>
                <div><${DECIMALFIELD_NAME} v-model="value" :valid-message="'Valid message'"></${DECIMALFIELD_NAME}></div>
                <div><${DECIMALFIELD_NAME} v-model="value" :helper-message="'Helper message'"></${DECIMALFIELD_NAME}></div>
                <div><${DECIMALFIELD_NAME} v-model="value" :error-message="'Error message'"></${DECIMALFIELD_NAME}></div>
            </div>
        `,
        data: () => ({
            value: undefined
        })
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DECIMALFIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('States', () => ({
        components: { MDecimalfield },
        template: `
            <div>
                <div><${DECIMALFIELD_NAME} v-model="value" :disabled="true" :placeholder="'Disabled'"></${DECIMALFIELD_NAME}></div>
                <div><${DECIMALFIELD_NAME} v-model="value" :placeholder="'Read-only'" :readonly="true"></${DECIMALFIELD_NAME}></div>
                <div><${DECIMALFIELD_NAME} v-model="value" :placeholder="'Waiting'" :waiting="true"></${DECIMALFIELD_NAME}></div>
            </div>
        `,
        data: () => ({
            value: undefined
        })
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DECIMALFIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('With initial value (0)', () => ({
        components: { MDecimalfield },
        template: `<${DECIMALFIELD_NAME} v-model="value"></${DECIMALFIELD_NAME}>`,
        data: () => ({
            value: 0
        })
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DECIMALFIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('With initial value', () => ({
        components: { MDecimalfield },
        template: `<${DECIMALFIELD_NAME} v-model="value"></${DECIMALFIELD_NAME}>`,
        data: () => ({
            value: 123456.78
        })
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DECIMALFIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('Localization', () => ({
        components: { MDecimalfield },
        template: `
            <${DECIMALFIELD_NAME} v-model="value"></${DECIMALFIELD_NAME}>
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
            value: 123456.78,
            originalLang: (Vue.prototype as ModulVue).$i18n.currentLang(),
            i18n: Vue.prototype.$i18n
        }),
        destroyed(): void {
            (Vue.prototype as ModulVue).$i18n.currentLang(this.originalLang);
        }
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DECIMALFIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('Default precision', () => ({
        components: { MDecimalfield },
        template: `
            <${DECIMALFIELD_NAME} v-model="value"></${DECIMALFIELD_NAME}>
        `,
        data: () => ({
            value: 9999999999999.99
        })
    }))
    .add('Custom precision', () => ({
        components: { MDecimalfield },
        template: `
            <${DECIMALFIELD_NAME} v-model="value" :precision="9" :rounding="4"></${DECIMALFIELD_NAME}>
        `,
        data: () => ({
            value: 99999.9999
        })
    }));
