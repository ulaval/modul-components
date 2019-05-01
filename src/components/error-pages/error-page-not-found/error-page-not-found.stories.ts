import { withA11y } from '@storybook/addon-a11y';
import { array, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../../conf/storybook/utils';
import ErrorPageNotFoundPlugin from './error-page-not-found';
import { ERROR_PAGE_NOT_FOUND_NAME } from '../../component-names';
import { Link } from '../../message-page/message-page';

Vue.use(ErrorPageNotFoundPlugin);

declare module '@storybook/addon-knobs' {
    export function withKnobs(): any;
}

storiesOf(`${componentsHierarchyRootSeparator}${ERROR_PAGE_NOT_FOUND_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('default', () => ({
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-page-not-found></m-error-page-not-found>
                   </div>`
    }))
    .add('title', () => ({
        props: {
            title: {
                default: text('Title', 'A Custom Title')
            }
        },
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-page-not-found :title="title"></m-error-page-not-found>
                   </div>`
    }))
    .add('links', () => ({
        props: {
            links: {
                default: array('Links[Array]', [new Link('The first custom link', 'http://www.ulaval.ca', true), new Link(`The second custom
                link`, 'http://www.google.com', true)])
            }
        },
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-page-not-found :links="links"></m-error-page-not-found>
                   </div>`
    }))
    .add('hints', () => ({
        props: {
            hints: {
                default: array('Hints[Array]', ['My only custom hint', `My second (long) custom hint.Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Nulla egestas urna rhoncus ipsum congue lobortis. `])
            }
        },
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-page-not-found :hints="hints"></m-error-page-not-found>
                   </div>`
    }));
