import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { DIALOG_NAME } from '../component-names';
import DialogPlugin from './dialog';

Vue.use(DialogPlugin);





storiesOf(`${componentsHierarchyRootSeparator}${DIALOG_NAME}`, module)


    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'A Dialog')
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp">{{ text }}</m-dialog>`
    }))
    .add('trigger (slot)', () => ({
        template: `<m-dialog>
                        <m-button slot="trigger">slot="trigger"</m-button>
                   </m-dialog>`
    }))
    .add('title', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" title="This is a title">A Dialog with a title</m-dialog>`
    }))
    .add('width="large"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" width="large">A Dialog with width="large"</m-dialog>`
    }))
    .add('hint', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" hint="Lorem ipsum dolor sit amet." >A Dialog with a hint </m-dialog>`
    }))
    .add('okLabel', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" okLabel="Custom primary Btn Label">
        A Dialog with a custom primary button label
                   </m-dialog>`
    }))
    .add('okPrecision', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" okPrecision="Custom primary Btn precision">
        A Dialog with a custom primary button precision
                   </m-dialog>`
    }))
    .add('secBtn="true"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" :secBtn="true">A Dialog with a secondary Button</m-dialog>`
    }))
    .add('secBtnLabel', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" :secBtn="true" secBtnLabel="Custom secondary Btn Label">
                        A Dialog with a custom secondary button label
                    </m-dialog>`
    }))
    .add('secBtnPrecision', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" :secBtn="true" secBtnPrecision="Custom secondary Btn precision">
                        A Dialog with a custom secondary button precision
                    </m-dialog>`
    }))
    .add('negativeLink="false"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" :negativeLink="false">A Dialog without a negativeLink</m-dialog>`
    }))
    .add('cancelLabel', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" cancelLabel="Custom negative Link Label">
                        A Dialog with a custom nagative Link label
                   </m-dialog>`
    }))
    .add('btnWidth="328px"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" btnWidth="328px">
                        A Dialog with a specified Btn Width of 328px
                   </m-dialog>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DIALOG_NAME}/state`, module)
    .add('default', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp">A default Dialog without a specified state</m-dialog>`
    }))
    .add('state="warning"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" state="warning">A Dialog with state="warning"</m-dialog>`
    }))
    .add('state="confirmation"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" state="confirmation">A Dialog with state="confirmation"</m-dialog>`
    }))
    .add('state="information"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" state="information">A Dialog with state="information"</m-dialog>`
    }))
    .add('state="error"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" state="error">A Dialog with state="error"</m-dialog>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${DIALOG_NAME}/Btn-Link Combos`, module)

    .add('default', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp">Default - primary button + cancel Link</m-dialog>`
    }))
    .add('secBtn="true"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" :secBtn="true">
                        primary button + secondary button + cancel Link
                    </m-dialog>`
    }))
    .add('negativeLink="false"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" :negativeLink="false">primary button only</m-dialog>`
    }))
    .add('secBtn="true" && negativeLink="false"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-dialog :open.sync="openProp" :secBtn="true" :negativeLink="false">
                            primary button + secondary button
                   </m-dialog>`
    }));
