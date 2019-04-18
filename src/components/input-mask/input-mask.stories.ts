import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { MInputMask } from './input-mask';


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}m-input-mask`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('Event fired', () => ({

        data(): any {
            return {
                value: '20002020',
                options: {
                    numericOnly: true,
                    delimiters: ['-', '-'],
                    blocks: [4, 2, 2]

                }
            };
        },
        components: { MInputMask },
        methods: {
            onInputChange(value: string): string {
                // tslint:disable-next-line: no-console
                console.log('MInputMask.onInputChange=' + value);
                return value;
            }
        },
        template: `<m-input-mask :options="options" :raw="false" :value="value" @input="value = onInputChange($event)"></m-input-mask>`
    }))
    .add('positive integer field', () => ({

        data(): any {
            return {
                model: '',
                options: {
                    numeral: true,
                    numeralThousandsGroupStyle: 'none',
                    numeralIntegerScale: 3,
                    numeralDecimalScale: 0,
                    numeralPositiveOnly: true,
                    stripLeadingZeroes: true

                }
            };
        },
        components: { MInputMask },
        template: `<div><m-input-mask :options="options" :raw="true" v-model="model"></m-input-mask><br/><br/> model= {{model}} </div>`
    }))
    .add('decimal integer field', () => ({

        data(): any {
            return {
                model: '',
                options: {
                    numeral: true,
                    numeralThousandsGroupStyle: 'none',
                    numeralIntegerScale: 3,
                    numeralDecimalScale: 2,
                    numeralPositiveOnly: true,
                    stripLeadingZeroes: true

                }
            };
        },
        components: { MInputMask },
        template: `<div><m-input-mask :options="options" :raw="true" v-model="model"></m-input-mask><br/><br/> model= {{model}} </div>`
    }))
    .add('money field', () => ({

        data(): any {
            return {
                model: '',
                options: {
                    numeral: true,
                    prefix: '$',
                    rawValueTrimPrefix: true

                }
            };
        },
        components: { MInputMask },
        template: `<div><m-input-mask :options="options" :raw="true" v-model="model"></m-input-mask><br/><br/> model= {{model}} </div>`
    }))
    .add('telephone field', () => ({

        data(): any {
            return {
                model: '',
                options: {
                    numericOnly: true,
                    delimiters: [' ', ' ', '-'],
                    prefix: '+1',
                    blocks: [2, 3, 3, 4]

                }
            };
        },
        components: { MInputMask },
        template: `<div><m-input-mask :options="options" :raw="false" v-model="model"></m-input-mask><br/><br/> model= {{model}} </div>`
    }))
    .add('date field', () => ({

        data(): any {
            return {
                model: '',
                options: {
                    numericOnly: true,
                    delimiters: ['-', '-'],
                    blocks: [4, 2, 2]

                }
            };
        },
        components: { MInputMask },
        template: `<div><m-input-mask :options="options" :raw="false" v-model="model"></m-input-mask><br/><br/> model= {{model}} </div>`
    }))
    ;


