import { boolean, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { MODAL_NAME } from '../component-names';
import ModalPlugin, { MModalSize } from './modal';

Vue.use(ModalPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${MODAL_NAME}`, module)


    .add('default', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text
                   </m-modal>`
    }))
    .add('close-on-backdrop="false"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :close-on-backdrop="false" title="A modal title">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }))
    .add('title', () => ({
        data: () => ({
            openProp: true
        }),
        props: {
            title: {
                default: text('title', 'This is a custom title')
            }
        },
        template: `<m-modal :open.sync="openProp" :title="title">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }))
    .add('padding="false"', () => ({
        data: () => ({
            openProp: true
        }),
        props: {
            padding: {
                default: boolean('padding', true)
            }
        },
        template: `<m-modal :open.sync="openProp" :padding="false" title="A modal title without padding">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text without padding
                        <p slot="footer">Some footer slot content without padding</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }))
    .add('padding-header="false"', () => ({
        data: () => ({
            openProp: true
        }),
        props: {
            paddingHeader: {
                default: boolean('paddingHeader', true)
            }
        },
        template: `<m-modal :open.sync="openProp" :padding-header="false" title="A modal title without padding">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }))
    .add('padding-body="false"', () => ({
        props: {
            paddingBody: {
                default: boolean('padding-body', true)
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :padding-body="false" title="A modal title">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text without padding
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }))
    .add('padding-footer', () => ({
        props: {
            paddingFooter: {
                default: boolean('padding-footer', true)
            }
        },
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" :padding-footer="false" title="A modal title">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text
                        <p slot="footer">Some footer slot content without padding</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MODAL_NAME}/size`, module)


    .add('size="small"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" size="small" title="A modal title">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }))
    .add('size="regular"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" size="regular" title="A modal title">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }))
    .add('size="large"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" size="large" title="A modal title">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }))
    .add('size="full-screen"', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp" size="full-screen" title="A modal title">
                        <m-button slot="trigger">Open the modal</m-button>
                        Some body text
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MODAL_NAME}/slots`, module)


    .add('trigger', () => ({
        data: () => ({
            openProp: false
        }),
        template: `<m-modal size="size">
                        <m-button slot="trigger">Open the modal (trigger)</m-button>
                   </m-modal>`
    }))
    .add('footer', () => ({
        data: () => ({
            openProp: true
        }),
        template: `<m-modal :open.sync="openProp">
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                   </m-modal>`
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MODAL_NAME}/all props`, module)


    .add('make your own', () => ({
        data: () => ({
            openProp: true
        }),
        props: {
            closeOnBackdrop: {
                default: boolean('close-on-backdrop', true)
            },
            title: {
                default: text('title', 'This is a custom title')
            },
            padding: {
                default: boolean('padding', true)
            },
            paddingHeader: {
                default: boolean('padding-header | (no effect if padding === false)', true)
            },
            paddingBody: {
                default: boolean('padding-body | (no effect if padding === false)', true)
            },
            paddingFooter: {
                default: boolean('padding-footer | (no effect if padding === false)', true)
            },
            size: {
                default: select('size', Object.values(MModalSize), MModalSize.Regular)
            }
        },
        template: `<m-modal :open.sync="openProp" :close-on-backdrop="closeOnBackdrop"
                    :padding="padding" :padding-header="paddingHeader" :padding-body="paddingBody"
                    :padding-footer="paddingFooter" :size="size" :title="title">
                        <m-button slot="trigger">Open the modal (trigger)</m-button>
                        Some body text
                        <p slot="footer">Some footer slot content</p>
                        <m-button slot="footer">Here goes nothing</m-button>
                    </m-modal>`
    }));
