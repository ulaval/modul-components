import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { TOOLTIP_NAME } from '../component-names';
import TooltipPlugin from './tooltip';
Vue.use(TooltipPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${TOOLTIP_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip>This is some random text</m-tooltip>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TOOLTIP_NAME}/mode`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('mode="icon"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<span>Lorem Ipsum<m-tooltip mode="icon">This is some random text</m-tooltip></span>`
    }))
    .add('mode="link"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<span>Spicy jalapeno
                        <m-tooltip mode="link">
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
                    <span>`
    }))
    .add('mode="definition"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<span>Spicy jalapeno
                        <m-tooltip mode="definition">
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
                    <span>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TOOLTIP_NAME}/size`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
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

storiesOf(`${componentsHierarchyRootSeparator}${TOOLTIP_NAME}/placement`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('placement="top"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="top">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="top-start"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="top-start">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="top-end"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="top-end">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="right"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="right">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="right-start"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="right-start">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="right-end"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="right-end">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="bottom"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="bottom">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="bottom-start"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="bottom-start">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="bottom-end"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="bottom-end">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="left"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="left">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="left-start"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="left-start">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }))
    .add('placement="left-end"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<div style="position: relative; height: 500px; width: 850px; background: #f7f7f7">
                        <span style="position: absolute; top: 40%">Prow scuttle parrel provost Sail ho shrouds spirits
                        boom mizzenmast yardarm.
                                <m-tooltip :open.sync="openProp" placement="left-end">Deadlights jack lad schooner scallywag
                                 dance the hempen jig carouser broadside cable strike colors.</m-tooltip>
                        </span>
                    </div>`
    }));
