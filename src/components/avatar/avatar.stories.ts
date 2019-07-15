import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { AVATAR_NAME } from '../component-names';
import AvatarPlugin from './avatar';

Vue.use(AvatarPlugin);

storiesOf(`${componentsHierarchyRootSeparator}${AVATAR_NAME}`, module)
    .add('Small', () => ({
        template: '<m-avatar size="32px"></m-avatar>'
    }))
    .add('Large', () => ({
        template: '<m-avatar size="192px"></m-avatar>'
    }))
    .add('Square', () => ({
        template: '<m-avatar size="192px" shape="square"></m-avatar>'
    }))
    .add('Image slot', () => ({
        template: '<m-avatar size="192px"><img slot="avatar" src="http://placekitten.com/192/192"></m-avatar>'
    }))
    .add('Editable', () => ({
        template: `<m-avatar size="192px" :editable="true"><img slot="avatar" src="http://placekitten.com/192/192"></m-avatar>`
    }))
    .add('Editable with custom slot', () => ({
        template: `<m-avatar size="192px" :editable="true"><img slot="avatar" src="http://placekitten.com/192/192"></m-avatar>`
    }));

