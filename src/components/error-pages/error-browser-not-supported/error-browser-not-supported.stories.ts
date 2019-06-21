import { array, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import Vue from 'vue';
import { componentsHierarchyRootSeparator } from '../../../../conf/storybook/utils';
import { ERROR_BROWSER_NOT_SUPPORTED_NAME } from '../../component-names';
import { Link } from '../../message-page/message-page';
import ErrorBrowserNotSupported from './error-browser-not-supported';

Vue.use(ErrorBrowserNotSupported);



storiesOf(`${componentsHierarchyRootSeparator}${ERROR_BROWSER_NOT_SUPPORTED_NAME}`, module)

    .add('default', () => ({
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-browser-not-supported></m-error-browser-not-supported>
                   </div>`
    }))
    .add('title', () => ({
        props: {
            title: {
                default: text('Title', 'A Custom Title')
            }
        },
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-browser-not-supported :title="title"></m-error-browser-not-supported>
                   </div>`
    }))
    .add('linksDesktop', () => ({
        props: {
            linksDesktop: {
                default: array('Links[Array]', [new Link('The first custom link', 'http://www.ulaval.ca', true), new Link(`The second custom
                link`, 'http://www.google.com', true)])
            }
        },
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-browser-not-supported :linksDesktop="linksDesktop"></m-error-browser-not-supported>
                   </div>`
    }))
    .add('linksMobile', () => ({
        props: {
            linksMobile: {
                default: array('Links[Array]', [new Link('The first custom link', 'http://www.ulaval.ca', true), new Link(`The second custom
                link`, 'http://www.google.com', true)])
            }
        },
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-browser-not-supported :linksMobile="linksMobile"></m-error-browser-not-supported>
                   </div>`
    }))
    .add('hintsDesktop', () => ({
        props: {
            hintsDesktop: {
                default: array('Hints[Array]', ['My only custom hint', `My second (long) custom hint.Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Nulla egestas urna rhoncus ipsum congue lobortis. `])
            }
        },
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-browser-not-supported :hintsDesktop="hintsDesktop"></m-error-browser-not-supported>
                   </div>`
    }))
    .add('hintsMobile', () => ({
        props: {
            hintsMobile: {
                default: array('Hints[Array]', ['My only custom hint', `My second (long) custom hint.Lorem ipsum dolor
                sit amet, consectetur adipiscing elit. Nulla egestas urna rhoncus ipsum congue lobortis. `])
            }
        },
        template: `<div style="border: solid 1px black; padding: 10px; width: 600px;">
                        <m-error-browser-not-supported :hintsMobile="hintsMobile"></m-error-browser-not-supported>
                   </div>`
    }));
