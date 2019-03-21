import { storiesOf, Story, StoryDecorator } from '@storybook/vue';
import { getSandboxesNames } from './sandbox-loader';



let sandboxeDecorator: StoryDecorator = () => {
    return {
        template: '<div style="padding: 32px;"><story /></div>'
    };
};

// legacy sandboxe loader for storybook
export const loadSandboxStories: any = () => {

    let sandboxes: Story = storiesOf(`Sandboxes`, module);
    sandboxes.addDecorator(sandboxeDecorator);
    sandboxes.addParameters({
        options: {
            showPanel: false
        }
    });

    getSandboxesNames().forEach((sandboxeName) => {
        sandboxes.add(`${sandboxeName}`, () => `<m-${sandboxeName}-sandbox></m-${sandboxeName}-sandbox>`)
    });
};
