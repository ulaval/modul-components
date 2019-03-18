import { storiesOf, Story } from '@storybook/vue';
import { getSandboxesNames } from './sandbox-loader';


// legacy sandboxe loader for storybook
export const loadSandboxStories: any = () => {

    let sandboxes: Story = storiesOf(`Sandboxes`, module);

    getSandboxesNames().forEach((sandboxeName) => {
        sandboxes.add(`${sandboxeName}`, () => `<m-${sandboxeName}-sandbox></m-${sandboxeName}-sandbox>`)
    });
};
