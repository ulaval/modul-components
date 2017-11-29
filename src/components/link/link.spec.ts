import Vue from 'vue';
import '../../utils/polyfills';
import LinkPlugin, { MLink, MLinkMode, MLinkIconPosition } from './link';
import { ICON_CLASS, validateIconSvg } from '../icon/icon.spec';
import { I18N_CLASS } from '../i18n/i18n.spec';
import Router from 'vue-router';
import SpritesHelper from '../../../tests/helpers/sprites';
import LangHelper from '../../../tests/helpers/lang';

const UNVISITED_CSS: string = 'm--is-unvisited';
const NO_UNDERLINE_CSS: string = 'm--no-underline';
const MODE_BUTTON_CSS: string = 'm--is-button';
const PLAIN_CSS: string = 'm--is-plain';
const ICON_POSITION_RIGHT_CSS: string = 'm--has-right-icon';
const DISABLED_CSS: string = 'm--is-disabled';

describe('MLinkMode', () => {
    it('validates enum', () => {
        expect(MLinkMode.Link).toEqual('link');
        expect(MLinkMode.Button).toEqual('button');
        expect(MLinkMode.RouterLink).toEqual('router-link');
    });
});

describe('MLinkIconPosition', () => {
    it('validates enum', () => {
        expect(MLinkIconPosition.Left).toEqual('left');
        expect(MLinkIconPosition.Right).toEqual('right');
    });
});

describe('link', () => {
    let vm: Vue;
    let router: Router;

    beforeEach(() => {
        spyOn(console, 'error');

        Vue.use(SpritesHelper);
        Vue.use(LangHelper);
        Vue.use(Router);
        Vue.use(LinkPlugin);

        router = new Router({
            mode: 'history',
            routes: [
                { path: '/test', component: { template: '<div></div>' } },
                { path: '/named/:paramId', name: 'named', component: { template: '<div></div>' } }
            ]
        });
    });

    afterEach(() => {
        Vue.nextTick(() => {
            expect(console.error).not.toHaveBeenCalled();
        });
    });

    describe('css class for router-link are not present', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink
                },
                template: `<m-link :mode="mode" url="/test"></m-link>`
            }).$mount();
        });

        const test = () => {
            expect(vm.$el.classList.contains(UNVISITED_CSS)).toBeFalsy();
            expect(vm.$el.classList.contains(NO_UNDERLINE_CSS)).toBeFalsy();
            expect(vm.$el.classList.contains(MODE_BUTTON_CSS)).toBeFalsy();
            expect(vm.$el.classList.contains(PLAIN_CSS)).toBeFalsy();
            expect(vm.$el.classList.contains(ICON_POSITION_RIGHT_CSS)).toBeFalsy();
            expect(vm.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });

    describe('url prop', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink,
                    url: '/test'
                },
                template: `<m-link ref="a" :mode="mode" :url="url"></m-link>`
            }).$mount();
        });

        describe('url', () => {
            const test = () => {
                let element: HTMLAnchorElement = (vm.$refs.a as Vue).$el as HTMLAnchorElement;

                expect(element.getAttribute('href')).toEqual('/test');
                (vm as any).url = '/path';
                Vue.nextTick(() => {
                    element = (vm.$refs.a as Vue).$el as HTMLAnchorElement;
                    expect(element.getAttribute('href')).toEqual('/path');
                });
            };

            it('router-link', () => {
                test();
            });

            it('link', () => {
                (vm as any).mode = MLinkMode.Link;
                test();
            });
        });

        describe('button url', () => {
            it('anchor', () => {
                (vm as any).mode = MLinkMode.Button;

                Vue.nextTick(() => {
                    let element: HTMLAnchorElement = (vm.$refs.a as Vue).$el as HTMLAnchorElement;

                    expect(element.getAttribute('href')).toEqual('#');
                    (vm as any).url = '/path';
                    Vue.nextTick(() => {
                        element = (vm.$refs.a as Vue).$el as HTMLAnchorElement;
                        expect(element.getAttribute('href')).toEqual('#');
                    });
                });
            });
        });

        describe('object url', () => {
            it('anchor', () => {
                (vm as any).mode = MLinkMode.Button;

                Vue.nextTick(() => {
                    let element: HTMLAnchorElement = (vm.$refs.a as Vue).$el as HTMLAnchorElement;

                    expect(element.getAttribute('href')).toEqual('#');
                    (vm as any).url = '/path';
                    Vue.nextTick(() => {
                        element = (vm.$refs.a as Vue).$el as HTMLAnchorElement;
                        expect(element.getAttribute('href')).toEqual('#');
                    });
                });
            });
        });

        describe('named routes', () => {
            it('anchor', () => {
                (vm as any).mode = MLinkMode.RouterLink;

                Vue.nextTick(() => {
                    let element: HTMLAnchorElement = (vm.$refs.a as Vue).$el as HTMLAnchorElement;

                    expect(element.getAttribute('href')).toEqual('/test');
                    (vm as any).url = { name: 'named', params: { paramId: 123 } };
                    Vue.nextTick(() => {
                        element = (vm.$refs.a as Vue).$el as HTMLAnchorElement;
                        expect(element.getAttribute('href')).toEqual('/named/123');
                    });
                });
            });
        });
    });

    describe('unvisited prop', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink,
                    unvisited: false
                },
                template: `<m-link ref="a" :mode="mode" :unvisited="unvisited" url="/test"></m-link>`
            }).$mount();
        });

        const test = () => {
            let element: Vue = vm.$refs.a as Vue;

            expect(element.$el.classList.contains(UNVISITED_CSS)).toBeFalsy();
            (vm as any).unvisited = true;
            Vue.nextTick(() => {
                expect(element.$el.classList.contains(UNVISITED_CSS)).toBeTruthy();
            });
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });

    describe('disabled prop', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink,
                    disabled: false
                },
                template: `<m-link ref="a" :mode="mode" :disabled="disabled" url="/test"></m-link>`
            }).$mount();
        });

        const test = () => {
            let element: Vue = vm.$refs.a as Vue;

            expect(element.$el.classList.contains(DISABLED_CSS)).toBeFalsy();
            (vm as any).disabled = true;
            Vue.nextTick(() => {
                expect(element.$el.classList.contains(DISABLED_CSS)).toBeTruthy();
            });
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });

    describe('underline prop', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink,
                    underline: false
                },
                template: `<m-link ref="a" :mode="mode" :underline="underline" url="/test"></m-link>`
            }).$mount();
        });

        const test = () => {
            let element: Vue = vm.$refs.a as Vue;

            expect(element.$el.classList.contains(NO_UNDERLINE_CSS)).toBeTruthy();
            (vm as any).underline = true;
            Vue.nextTick(() => {
                expect(element.$el.classList.contains(NO_UNDERLINE_CSS)).toBeFalsy();
            });
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });

    describe('Plain prop', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink,
                    plain: false
                },
                template: `<m-link ref="a" :mode="mode" :plain="plain" url="/test"></m-link>`
            }).$mount();
        });

        const test = () => {
            let element: Vue = vm.$refs.a as Vue;

            expect(element.$el.classList.contains(PLAIN_CSS)).toBeFalsy();
            (vm as any).plain = true;
            Vue.nextTick(() => {
                expect(element.$el.classList.contains(PLAIN_CSS)).toBeTruthy();
            });
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });

    describe('icon prop', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink,
                    icon: false
                },
                template: `<m-link ref="a" :mode="mode" :icon="icon" url="/test"></m-link>`
            }).$mount();
        });

        const test = () => {
            let element: Element | null = (vm.$refs.a as Vue).$el.querySelector(ICON_CLASS);
            expect(element).toBeFalsy();

            (vm as any).icon = true;
            Vue.nextTick(() => {
                element = (vm.$refs.a as Vue).$el.querySelector(ICON_CLASS);
                expect(element).toBeTruthy();
                if (element) {
                    validateIconSvg(element, 'right-arrow');
                }
            });
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });

    describe('icon-name prop', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink,
                    icon: ''
                },
                template: `<m-link ref="a" :mode="mode" :icon-name="icon" url="/test"></m-link>`
            }).$mount();
        });

        const test = () => {
            let element: Element | null = (vm.$refs.a as Vue).$el.querySelector(ICON_CLASS);
            expect(element).toBeFalsy();

            (vm as any).icon = 'clock';
            Vue.nextTick(() => {
                element = (vm.$refs.a as Vue).$el.querySelector(ICON_CLASS);
                expect(element).toBeTruthy();
                if (element) {
                    validateIconSvg(element, 'clock');
                }
            });
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });

    describe('icon-position prop', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink,
                    position: MLinkIconPosition.Left
                },
                template: `<m-link ref="a" :mode="mode" :icon-position="position" url="/test"></m-link>`
            }).$mount();
        });

        const test = () => {
            let element: Vue = vm.$refs.a as Vue;

            expect(element.$el.classList.contains(ICON_POSITION_RIGHT_CSS)).toBeFalsy();
            (vm as any).position = MLinkIconPosition.Right;
            Vue.nextTick(() => {
                expect(element.$el.classList.contains(ICON_POSITION_RIGHT_CSS)).toBeTruthy();
            });
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });

    describe('icon-size prop', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink,
                    size: '12px'
                },
                template: `<m-link ref="a" :mode="mode" :icon="true" :icon-size="size" url="/test"></m-link>`
            }).$mount();
        });

        const test = () => {
            let element: HTMLElement | null = (vm.$refs.a as Vue).$el.querySelector(ICON_CLASS) as HTMLElement;
            expect(element).toBeTruthy();

            expect(element.getAttribute('height')).toEqual('12px');
            (vm as any).size = '16px';
            Vue.nextTick(() => {
                element = (vm.$refs.a as Vue).$el.querySelector(ICON_CLASS) as HTMLElement;
                expect(element.getAttribute('width')).toBe('16px');
            });
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });

    describe('text content', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink
                },
                template: `<m-link :mode="mode" url="/test">Link</m-link>`
            }).$mount();
        });

        const test = () => {
            let element: HTMLElement | null = vm.$el.querySelector('.m-link__text') as HTMLElement;
            expect(element).toBeTruthy();
            expect(element.textContent).toEqual('Link');
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });

    describe('target prop', () => {
        beforeEach(() => {
            vm = new Vue({
                router,
                data: {
                    mode: MLinkMode.RouterLink,
                    target: '_self'
                },
                template: `<m-link ref="a" :mode="mode" :target="target" url="/test"></m-link>`
            }).$mount();
        });

        const test = () => {
            let hidden: Element | null = (vm.$refs.a as Vue).$el.querySelector(I18N_CLASS);
            expect(hidden).toBeFalsy();

            (vm as any).target = '_blank';
            Vue.nextTick(() => {
                hidden = (vm.$refs.a as Vue).$el.querySelector(I18N_CLASS);
                expect(hidden).toBeTruthy();
                expect((vm.$refs.a as Vue).$el.getAttribute('target')).toEqual('_blank');
            });
        };

        it('router-link', () => {
            test();
        });

        it('link', () => {
            (vm as any).mode = MLinkMode.Link;
            test();
        });
    });
});
