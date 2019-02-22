import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import { MediaQueriesTest } from './media-queries/media-queries';
import { Navigation } from './navigation/navigation';
import { TypoAndStylesTest } from './typo-and-styles/typo-and-styles';
import { Viewer } from './viewer/viewer';
import { getSandboxesNames } from './sandbox-loader';


Vue.use(Router);

const routerFactory: () => Router = () => {
    const componentRoutes: RouteConfig[] = [
        {
            path: '/',
            component: Navigation
        },
        {
            path: '/media-queries',
            component: MediaQueriesTest
        },
        {
            path: '/typo-and-styles',
            component: TypoAndStylesTest
        }
    ];

    getSandboxesNames().forEach(tag => {

        componentRoutes.push({
            path: '/sandboxes/' + tag,
            meta: tag,
            component: Viewer
        });
    });

    let router: Router = new Router({
        mode: 'history',
        routes: componentRoutes,
        scrollBehavior: (to, from, savedPosition) => {
            if (savedPosition) {
                return savedPosition;
            }
            if (to.hash) {
                return { selector: to.hash };
            }
            return { x: 0, y: 0 };
        }
    });

    router.beforeEach((to, from, next) => {
        next();
    });

    return router;
};

export default routerFactory;
