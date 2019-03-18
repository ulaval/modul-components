import { storiesOf } from '@storybook/vue';
import { componentshierarchyRootSeparator } from '../../../conf/storybook/utils';
import { BUTTON_NAME } from '../component-names';



storiesOf(`${componentshierarchyRootSeparator}${BUTTON_NAME}`, module)
    .add('default', () => '<m-button ></m-button>');
