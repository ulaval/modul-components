import { storiesOf } from '@storybook/vue';
import { Welcome } from './welcome/welcome';

storiesOf('Welcome', module)
    .addParameters({ options: { showPanel: false } })
    .add('Welcome', () => ({
        render: h => h(Welcome)
    }));
