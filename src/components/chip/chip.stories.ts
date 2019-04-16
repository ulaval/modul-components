import { withA11y } from '@storybook/addon-a11y';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { CHIP_NAME } from '../component-names';
import ChipPlugin from './chip';

Vue.use(ChipPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${CHIP_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        props: {
            text: {
                default: text('Text', 'test')
            },
            disposable: {
                default: boolean('Disposable', true)
            }
        },
        methods: {
            onClose(): void {
                alert('closed');
            }
        },
        template: '<m-chip :text="text" :disposable="disposable" @closed="onClose()">{{text}}</m-chip>'
    }));
