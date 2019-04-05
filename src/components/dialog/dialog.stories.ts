import { withA11y } from '@storybook/addon-a11y';
import { text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { DIALOG_NAME } from '../component-names';
import DialogPlugin from './dialog';

Vue.use(DialogPlugin);


declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}


storiesOf(`${componentsHierarchyRootSeparator}${DIALOG_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'A Dialog')
            }
        },
        template: `<p>Dialog needs a trigger</p>
                   <m-dialog>{{ text }}</m-dialog>`
    }))
    .add('trigger', () => ({
        template: `<m-dialog>
                        <m-button slot="trigger">Value specified in trigger slot for this example and all others to follow</m-button>
                   </m-dialog>`
    }))
    .add('title"', () => ({
        template: `<m-dialog title="This is a title">
        A Dialog with a title
        <m-button slot="trigger">Title</m-button>
                    </m-dialog>`
    }))
    .add('width="large"', () => ({
        template: `<m-dialog width="large">
        A Dialog with width="large"
        <m-button slot="trigger">width="large</m-button>
                    </m-dialog>`
    }))
    .add('hint', () => ({
        template: `<m-dialog hint="Lorem ipsum dolor sit amet, consectetur adipiscing elit. tique enim porttitor porta.">
        A Dialog with a hint
        <m-button slot="trigger">hint</m-button>
                    </m-dialog>`
    }))
    .add('okLabel', () => ({
        template: `<m-dialog okLabel="Custom primary Btn Label">
        A Dialog with a custom primary button label
        <m-button slot="trigger">okLabel</m-button>
                    </m-dialog>`
    }))
    .add('okPrecision', () => ({
        template: `<m-dialog okPrecision="Custom primary Btn precision">
        A Dialog with a custom primary button precision
        <m-button slot="trigger">okPrecision</m-button>
                    </m-dialog>`
    }))
    .add('secBtn="true"', () => ({
        template: `<m-dialog :secBtn="true">
        A Dialog with a secondary Button
        <m-button slot="trigger">secBtn="true"</m-button>
                    </m-dialog>`
    }))
    .add('secBtnLabel', () => ({
        template: `<m-dialog :secBtn="true" secBtnLabel="Custom secondary Btn Label">
        A Dialog with a custom secondary button label
        <m-button slot="trigger">secBtnLabel</m-button>
                    </m-dialog>`
    }))
    .add('secBtnPrecision', () => ({
        template: `<m-dialog :secBtn="true" secBtnPrecision="Custom secondary Btn precision">
        A Dialog with a custom secondary button precision
        <m-button slot="trigger">secBtnPrecision</m-button>
                    </m-dialog>`
    }))
    .add('negativeLink="false"', () => ({
        template: `<m-dialog :negativeLink="false">
        A Dialog without a negativeLink
        <m-button slot="trigger">negativeLink="false"</m-button>
                    </m-dialog>`
    }))
    .add('cancelLabel', () => ({
        template: `<m-dialog cancelLabel="Custom negative Link Label">
        A Dialog with a custom nagative Link label
        <m-button slot="trigger">cancelLabel</m-button>
                    </m-dialog>`
    }))
    .add('btnWidth="328px"', () => ({
        template: `<m-dialog btnWidth="328px">
        A Dialog with a specified Btn Width of 328px
        <m-button slot="trigger">btnWidth="328px"</m-button>
                    </m-dialog>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DIALOG_NAME}/type`, module)
    .addDecorator(withA11y)
    .add('default', () => ({
        template: `<m-dialog>
        A Dialog without the prop: type
        <m-button slot="trigger">Default</m-button>
                    </m-dialog>`
    }))
    .add('type="warning"', () => ({
        template: `<m-dialog type="warning">A Dialog
        A Dialog with type="warning"
        <m-button slot="trigger">type="warning"</m-button>
                    </m-dialog>`
    }))
    .add('type="confirmation"', () => ({
        template: `<m-dialog type="confirmation">A Dialog
        A Dialog with type="confirmation"
        <m-button slot="trigger">type="confirmation"</m-button>
                    </m-dialog>`
    }))
    .add('type="information"', () => ({
        template: `<m-dialog type="information">A Dialog
        A Dialog with type="information"
        <m-button slot="trigger">type="information"</m-button>
                    </m-dialog>`
    }))
    .add('type="error"', () => ({
        template: `<m-dialog type="error">A Dialog
        A Dialog with type="error"
        <m-button slot="trigger">type="error"</m-button>
                    </m-dialog>`
    }));
