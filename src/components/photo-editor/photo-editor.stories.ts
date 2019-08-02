import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { PHOTO_EDITOR_NAME } from '../component-names';
import PhotoEditorPlugin from './photo-editor';

Vue.use(PhotoEditorPlugin);

storiesOf(`${componentsHierarchyRootSeparator}${PHOTO_EDITOR_NAME}`, module)
    .add('Default', () => ({
        template: `<m-photo-editor url="http://i.imgur.com/Fq2DMeH.jpg"></m-photo-editor>`
    }));
