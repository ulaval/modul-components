import { withA11y } from '@storybook/addon-a11y';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { MODAL_NAME } from '../component-names';
import ModalPlugin from './modal';

Vue.use(ModalPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

const MODAL_SIZES: {} = {
    'small': 'small',
    'regular': 'regular',
    'large': 'large',
    'full-screen': 'full-screen'
};


storiesOf(`${componentsHierarchyRootSeparator}${MODAL_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('closeOnBackdrop', () => ({
        props: {
            closeOnBackdrop: {
                default: boolean('closeOnBackdrop', true)
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :closeOnBackdrop="closeOnBackdrop">Some text</m-modal>`
    }))
    .add('focusManagement', () => ({
        props: {
            focusManagement: {
                default: boolean('focusManagement', true)
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :focusManagement="focusManagement">Some text</m-modal>`
    }))
    .add('title', () => ({
        props: {
            title: {
                default: text('title', 'This is a custom title')
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :title="title">Some text</m-modal>`
    }))
    .add('padding', () => ({
        props: {
            padding: {
                default: boolean('padding', true)
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :padding="padding">Some text</m-modal>`
    }))
    .add('paddingHeader', () => ({
        props: {
            paddingHeader: {
                default: boolean('paddingHeader', true)
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :paddingHeader="paddingHeader">Some text</m-modal>`
    }))
    .add('paddingBody', () => ({
        props: {
            paddingBody: {
                default: boolean('paddingBody', true)
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :paddingBody="paddingBody">Some text</m-modal>`
    }))
    .add('paddingFooter', () => ({
        props: {
            paddingFooter: {
                default: boolean('paddingFooter', true)
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :paddingFooter="paddingFooter">Some text</m-modal>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MODAL_NAME}/size`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('all sizes', () => ({
        props: {
            size: {
                default: select('size', MODAL_SIZES, 'regular')
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" size="size">Some text</m-modal>`
    }))
    .add('size="small"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" size="small">Some text</m-modal>`
    }))
    .add('size="regular"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" size="regular">Some text</m-modal>`
    }))
    .add('size="large"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" size="large">Some text</m-modal>`
    }))
    .add('size="full-screen"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" size="full-screen">Some text</m-modal>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MODAL_NAME}/slots`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('trigger', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal size="size">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some text
                   </m-modal>`
    }))
    .add('footer', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp">
                        Some text
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MODAL_NAME}/all props`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('make your own', () => ({
        props: {
            closeOnBackdrop: {
                default: boolean('closeOnBackdrop', true)
            },
            focusManagement: {
                default: boolean('focusManagement', true)
            },
            title: {
                default: text('title', 'This is a custom title')
            },
            padding: {
                default: boolean('padding', true)
            },
            paddingHeader: {
                default: boolean('paddingHeader', true)
            },
            paddingBody: {
                default: boolean('paddingBody', true)
            },
            paddingFooter: {
                default: boolean('paddingFooter', true)
            },
            size: {
                default: select('size', MODAL_SIZES, 'regular')
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :closeOnBackdrop="closeOnBackdrop" :focusManagement="focusManagement"
                    :padding="padding" :paddingHeader="paddingHeader" :paddingBody="paddingBody"
                    :paddingFooter="paddingFooter" :size="size" :title="title"></m-modal>`
    }));
