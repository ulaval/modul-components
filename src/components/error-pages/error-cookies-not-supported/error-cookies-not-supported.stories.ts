import { array, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../../conf/storybook/utils';
import { ERROR_COOKIES_NOT_SUPPORTED_NAME } from '../../component-names';
import { Link } from '../../message-page/message-page';
import ErrorCookiesNotSupportedPlugin from './error-cookies-not-supported';

Vue.use(ErrorCookiesNotSupportedPlugin);



storiesOf(`${componentsHierarchyRootSeparator}${ERROR_COOKIES_NOT_SUPPORTED_NAME}`, module)


    .add('default', () => ({
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-cookies-not-supported></m-error-cookies-not-supported>
                   </div>`
    }))
    .add('title', () => ({
        props: {
            title: {
                default: text('Title', 'A Custom Title')
            }
        },
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-cookies-not-supported :title="title"></m-error-cookies-not-supported>
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
                        <m-error-cookies-not-supported :links="links"></m-error-cookies-not-supported>
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
                        <m-error-cookies-not-supported :hints="hints"></m-error-cookies-not-supported>
                   </div>`
    }));
