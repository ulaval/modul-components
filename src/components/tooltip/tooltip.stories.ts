import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { TOOLTIP_NAME } from '../component-names';
import TooltipPlugin, { MTooltipMode, MTooltipSize } from './tooltip';
import { MPopperPlacement } from '../popper/popper';
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
        template: '<m-tooltip mode="icon">This is some random text</m-tooltip>'
    }))
    .add('mode="link"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip mode="link"><a href="http://www.google.ca">This is a link to Google</a></m-tooltip>'
    }))
    .add('mode="definition"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip mode="definition">This is some random text</m-tooltip>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TOOLTIP_NAME}/size`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('size="small"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" size="small">This is some random text</m-tooltip>'
    }))
    .add('size="large"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" size="large">This is some random text</m-tooltip>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${TOOLTIP_NAME}/placement`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('placement="top"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="top">This is some random text</m-tooltip>'
    }))
    .add('placement="top-start"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="top-start">This is some random text</m-tooltip>'
    }))
    .add('placement="top-end"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="top-end">This is some random text</m-tooltip>'
    }))
    .add('placement="right"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="right">This is some random text</m-tooltip>'
    }))
    .add('placement="right-start"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="right-start">This is some random text</m-tooltip>'
    }))
    .add('placement="right-end"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="right-end">This is some random text</m-tooltip>'
    }))
    .add('placement="bottom"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="bottom">This is some random text</m-tooltip>'
    }))
    .add('placement="bottom-start"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="bottom-start">This is some random text</m-tooltip>'
    }))
    .add('placement="bottom-end"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="bottom-end">This is some random text</m-tooltip>'
    }))
    .add('placement="left"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="left">This is some random text</m-tooltip>'
    }))
    .add('placement="left-start"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="left-start">This is some random text</m-tooltip>'
    }))
    .add('placement="left-end"', () => ({
        data: () => ({
            openProp: true
        }),
        template: '<m-tooltip :open.sync="openProp" placement="left-end">This is some random text</m-tooltip>'
    }));
