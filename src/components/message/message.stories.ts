import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import { MESSAGE_NAME } from '../component-names';
import MessagePlugin from './message';
Vue.use(MessagePlugin);





storiesOf(`${componentsHierarchyRootSeparator}${MESSAGE_NAME}`, module)


    .add('default', () => ({
        template: '<m-message>A message for testing purposes</m-message>'
    }))
    .add('icon="false"', () => ({
        template: '<m-message :icon="false">A Button</m-message>'
    }))
    .add('title', () => ({
        template: '<m-message title="This is a title">A Button</m-message>'
    }))
    .add('close-button', () => ({
        template: '<m-message :close-button="true">A Button</m-message>'
    }))
    .add('visible="false"', () => ({
        template: '<m-message :visible="false">A Button</m-message>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${MESSAGE_NAME}/state`, module)

    .add('default (confirmation)', () => ({
        template: '<m-message>state: confirmation</m-message>'
    }))
    .add('state="information"', () => ({
        template: '<m-message state="information">state: information</m-message>'
    }))
    .add('state="warning"', () => ({
        template: '<m-message state="warning">state: warning</m-message>'
    }))
    .add('state="error"', () => ({
        template: '<m-message state="error">state: error</m-message>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MESSAGE_NAME}/skin="default"`, module)

    .add('state="confirmation"', () => ({
        template: '<m-message state="confirmation">A message for confirmation purposes</m-message>'
    }))
    .add('state="confirmation" && title', () => ({
        template: '<m-message state="confirmation" title="Confirmation Title">A message for confirmation purposes</m-message>'
    }))
    .add('state="information"', () => ({
        template: '<m-message state="information">A message for information purposes</m-message>'
    }))
    .add('state="information" && title', () => ({
        template: '<m-message state="information" title="Information Title">A message for information purposes</m-message>'
    }))
    .add('state="warning"', () => ({
        template: '<m-message state="warning">A message for warning purposes</m-message>'
    }))
    .add('state="warning" && title', () => ({
        template: '<m-message state="warning" title="Warning Title">A message for warning purposes</m-message>'
    }))
    .add('state="error"', () => ({
        template: '<m-message state="error">A message for error purposes</m-message>'
    }))
    .add('state="error" && title', () => ({
        template: '<m-message state="error" title="Error Title">A message for error purposes</m-message>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MESSAGE_NAME}/skin="light"`, module)

    .add('state="confirmation"', () => ({
        template: '<m-message skin="light" state="confirmation">A message for confirmation purposes</m-message>'
    }))
    .add('state="confirmation" && title', () => ({
        template: '<m-message skin="light" state="confirmation" title="Confirmation Title">A message for confirmation purposes</m-message>'
    }))
    .add('state="information"', () => ({
        template: '<m-message skin="light" state="information">A message for information purposes</m-message>'
    }))
    .add('state="information" && title', () => ({
        template: '<m-message skin="light" state="information" title="Information Title">A message for information purposes</m-message>'
    }))
    .add('state="warning"', () => ({
        template: '<m-message skin="light" state="warning">A message for warning purposes</m-message>'
    }))
    .add('state="warning" && title', () => ({
        template: '<m-message skin="light" state="warning" title="Warning Title">A message for warning purposes</m-message>'
    }))
    .add('state="error"', () => ({
        template: '<m-message skin="light" state="error">A message for error purposes</m-message>'
    }))
    .add('state="error" && title', () => ({
        template: '<m-message skin="light" state="error" title="Error Title">A message for error purposes</m-message>'
    }));

storiesOf(`${componentsHierarchyRootSeparator}${MESSAGE_NAME}/skin="page-light"`, module)

    .add('state="confirmation"', () => ({
        template: '<m-message skin="page-light" state="confirmation">A message for confirmation purposes</m-message>'
    }))
    .add('state="confirmation" && title', () => ({
        template: '<m-message skin="page-light" state="confirmation" title="Confirmation Title">A message for confirmation purposes</m-message>'
    }))
    .add('state="information"', () => ({
        template: '<m-message skin="page-light" state="information">A message for information purposes</m-message>'
    }))
    .add('state="information" && title', () => ({
        template: '<m-message skin="page-light" state="information" title="Information Title">A message for information purposes</m-message>'
    }))
    .add('state="warning"', () => ({
        template: '<m-message skin="page-light" state="warning">A message for warning purposes</m-message>'
    }))
    .add('state="warning" && title', () => ({
        template: '<m-message skin="page-light" state="warning" title="Warning Title">A message for warning purposes</m-message>'
    }))
    .add('state="error"', () => ({
        template: '<m-message skin="page-light" state="error">A message for error purposes</m-message>'
    }))
    .add('state="error" && title', () => ({
        template: '<m-message skin="page-light" state="error" title="Error Title">A message for error purposes</m-message>'
    }));


storiesOf(`${componentsHierarchyRootSeparator}${MESSAGE_NAME}/skin="page"`, module)

    .add('state="confirmation"', () => ({
        template: '<m-message skin="page" state="confirmation">A message for confirmation purposes</m-message>'
    }))
    .add('state="confirmation" && title', () => ({
        template: '<m-message skin="page" state="confirmation" title="Confirmation Title">A message for confirmation purposes</m-message>'
    }))
    .add('state="information"', () => ({
        template: '<m-message skin="page" state="information">A message for information purposes</m-message>'
    }))
    .add('state="information" && title', () => ({
        template: '<m-message skin="page" state="information" title="Information Title">A message for information purposes</m-message>'
    }))
    .add('state="warning"', () => ({
        template: '<m-message skin="page" state="warning">A message for warning purposes</m-message>'
    }))
    .add('state="warning" && title', () => ({
        template: '<m-message skin="page" state="warning" title="Warning Title">A message for warning purposes</m-message>'
    }))
    .add('state="error"', () => ({
        template: '<m-message skin="page" state="error">A message for error purposes</m-message>'
    }))
    .add('state="error" && title', () => ({
        template: '<m-message skin="page" state="error" title="Error Title">A message for error purposes</m-message>'
    }));




