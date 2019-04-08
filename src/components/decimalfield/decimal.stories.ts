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
    .add('default', () => ({
        components: { MDecimalfield },
        template: `<${DECIMALFIELD_NAME} v-model="value"></${DECIMALFIELD_NAME}>`,
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
