import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { SEARCHFIELD_NAME } from '../component-names';
import { MSearchfield } from './searchfield';

storiesOf(`${componentsHierarchyRootSeparator}${SEARCHFIELD_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('Basic', () => ({
        components: { MSearchfield },
        template: `
            <div>
                <div><${SEARCHFIELD_NAME} v-model="value"></${SEARCHFIELD_NAME}></div>
            </div>
        `,
        data: () => ({
            value: undefined
        })
    }));
