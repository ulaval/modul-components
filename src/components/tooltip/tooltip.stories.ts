import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { TOOLTIP_NAME } from '../component-names';
import TooltipPlugin from './tooltip';
Vue.use(TooltipPlugin);





storiesOf(`${componentsHierarchyRootSeparator}${TOOLTIP_NAME}`, module)

    .add('default', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<span>Lorem Ipsum<m-tooltip :open="openProp">This is some random text</m-tooltip></span>`
    }))
    .add('close-button="false"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<span>Lorem Ipsum<m-tooltip :close-button="false" :open="openProp">This is some random text</m-tooltip></span>`
    }))
    .add('disabled', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<span>Lorem Ipsum<m-tooltip :disabled="true">This is some random text</m-tooltip></span>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TOOLTIP_NAME}/mode`, module)

    .add('mode="icon"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<span>Lorem Ipsum<m-tooltip mode="icon" :open="openProp">This is some random text</m-tooltip></span>`
    }))
    .add('mode="link"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<span>Spicy jalapeno
                        <m-tooltip mode="link" :open="openProp">
                        <span slot="link">bacon ipsum</span>
                        <p class="m-u--no-margin">What is Bacon Ipsum?</p>
                        <p>Simply put, it’s a take on the lorem ipsum filler text used when doing design mockups.
                         I was mocking up a web design one day and needed a few words to fill out a link. “Lorem ipsum
                         bacon” popped into my head, so I plugged that into my HTML. Later that day, it hit me.
                         Make a lorem ipsum generator but use types and cuts of meat.</p>
                        </m-tooltip>
                    dolor amet irure deserunt dolore bacon, ribeye turkey salami tongue consectetur meatball turducken
                    ball tip jowl. Chicken laborum strip steak ut picanha adipisicing turducken do doner ad prosciutto
                    pastrami ullamco.</p>
                    </span>`
    }))
    .add('mode="definition"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<span>Spicy jalapeno
                        <m-tooltip mode="definition" :open="openProp">
                        <span slot="link">bacon ipsum</span>
                        <p class="m-u--no-margin">What is Bacon Ipsum?</p>
                        <p>Simply put, it’s a take on the lorem ipsum filler text used when doing design mockups.
                         I was mocking up a web design one day and needed a few words to fill out a link. “Lorem ipsum
                         bacon” popped into my head, so I plugged that into my HTML. Later that day, it hit me.
                         Make a lorem ipsum generator but use types and cuts of meat.</p>
                        </m-tooltip>
                    dolor amet irure deserunt dolore bacon, ribeye turkey salami tongue consectetur meatball turducken
                    ball tip jowl. Chicken laborum strip steak ut picanha adipisicing turducken do doner ad prosciutto
                    pastrami ullamco.</p>
                    </span>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TOOLTIP_NAME}/size`, module)

    .add('size="small"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<span>Lorem Ipsum<m-tooltip :open.sync="openProp" size="small">This is some random text</m-tooltip></span>'
    }))
    .add('size="large"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<span>Lorem Ipsum<m-tooltip :open.sync="openProp" size="large">This is some random text</m-tooltip></span>'
    }));

