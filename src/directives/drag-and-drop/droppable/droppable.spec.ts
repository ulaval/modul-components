import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { resetModulPlugins } from '../../../../tests/helpers/component';
import { isInElement } from '../../../utils/mouse/mouse';
import { polyFillActive } from '../../../utils/polyfills';
import { MDOMPlugin } from '../../domPlugin';
import { MRemoveUserSelect } from '../../user-select/remove-user-select';
import DraggablePlugin, { MDraggable, MDraggableOptions } from '../draggable/draggable';
import DroppablePlugin, { MDropEffect, MDroppable, MDroppableClassNames, MDroppableEventNames, MDroppableOptions } from './droppable';
Vue.config.silent = true;


jest.mock('../../../utils/mouse/mouse');
let mockTargetIsInput: boolean = false;
jest.mock('../../../utils/event/event', () => ({ targetIsInput(): boolean { return mockTargetIsInput; } }));

jest.mock('../../../utils/vue/events', () => ({
    dispatchEvent: (element: HTMLElement, eventName: string, eventData: any) => {
        const vue: Vue = (element as any).__vue__;
        if (vue && vue.$children.length) {
            return vue.$children[0].$emit(eventName, eventData);
        }
    }
}));

beforeEach(() => {
    mockTargetIsInput = false;
});

describe('droppable', () => {
    polyFillActive.dragDrop = false;

    const getDroppableDirective: (bindingValue?: boolean, options?: MDroppableOptions, innerHtml?: string) => Wrapper<Vue> =
        (bindingValue?: boolean, options?: MDroppableOptions, innerHtml?: string) => {
            let directive: Wrapper<Vue>;
            if (options) {
                directive = mount({
                    template: bindingValue === undefined ? `<div v-m-droppable :accepted-actions="acceptedActions" :grouping="grouping">${innerHtml || ''}</div>`
                        : `<div v-m-droppable="${bindingValue}" :accepted-actions="acceptedActions" :grouping="grouping">${innerHtml || ''}</div>`,
                    data: () => options
                }, { localVue: Vue });
            } else {
                directive = mount({
                    template: bindingValue === undefined ? `<div v-m-droppable>${innerHtml || ''}</div>`
                        : `<div v-m-droppable="${bindingValue}">${innerHtml || ''}</div>`
                }, { localVue: Vue });
            }
            return directive.find('div');
        };

    const getDraggableDirective: (bindingValue?: boolean, options?: MDraggableOptions, innerHtml?: string) => Wrapper<Vue> =
        (bindingValue?: boolean, options?: MDraggableOptions, innerHtml?: string) => {
            let directive: Wrapper<Vue>;
            if (options) {
                directive = mount({
                    template: bindingValue === undefined ? `<div v-m-draggable :action="action" :drag-data="dragData" :grouping="grouping"></div>`
                        : `<div v-m-draggable="${bindingValue}" :action="action" :drag-data="dragData" :grouping="grouping"></div>`,
                    data: () => options
                }, { localVue: Vue });
            } else {
                directive = mount({
                    template: bindingValue === undefined ? `<div v-m-draggable></div>`
                        : `<div v-m-draggable="${bindingValue}"></div>`
                }, { localVue: Vue });
            }

            return directive.find('div');
        };

    const getEventDummy: () => any = () => {
        return { preventDefault: jest.fn(), stopPropagation: jest.fn(), dataTransfer: { setData: jest.fn(), setDragImage: jest.fn(), getData: jest.fn() } };
    };

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(DroppablePlugin);
        Vue.use(DraggablePlugin);
    });

    [true, undefined].forEach(param => {
        it(`should render correctly when binding ${param} is provided`, () => {
            const userDefinedActions: string[] = ['a', 'b'];
            const droppable: Wrapper<Vue> = getDroppableDirective(param, { acceptedActions: userDefinedActions });

            expect(droppable.element.classList).toContain(MDroppableClassNames.Droppable);
            expect(MDOMPlugin.get(MDroppable, droppable.element)!.options.acceptedActions).toBe(userDefinedActions);
            expect(MDOMPlugin.get(MRemoveUserSelect, droppable.element)).toBeDefined();
        });

        [undefined].forEach(emptyValue => {
            it(`should default action correctly when binding ${param} is provided and action is not user defined`, () => {
                const droppable: Wrapper<Vue> = getDroppableDirective(param, { acceptedActions: emptyValue! });
                expect(MDOMPlugin.get(MDroppable, droppable.element)!.options.acceptedActions).toEqual(['any']);
            });
        });
    });

    describe('unbind', () => {
        it('should clean up element correctly', () => {
            const droppable: Wrapper<Vue> = getDroppableDirective();
            const element: HTMLElement = droppable.element;
            const droppablePlugin: MDroppable | undefined = MDOMPlugin.get(MDroppable, droppable.element);
            jest.spyOn(droppablePlugin!, 'cleanupCssClasses');

            droppable.destroy();

            expect(droppablePlugin!.cleanupCssClasses).toHaveBeenCalled();
            expect(element.classList).not.toContain(MDroppableClassNames.Droppable);
            expect(MDOMPlugin.get(MRemoveUserSelect, element)).toBeUndefined();
        });

        it('should clean up events correctly', () => {
            const droppable: Wrapper<Vue> = getDroppableDirective();
            const element: HTMLElement = droppable.element;
            const droppablePlugin: MDroppable | undefined = MDOMPlugin.get(MDroppable, element);
            jest.spyOn(droppablePlugin!, 'removeAllEvents');
            droppable.destroy();

            expect(droppablePlugin!.removeAllEvents).toHaveBeenCalled();
        });
    });

    describe('onDragLeave', () => {
        let droppable: Wrapper<Vue>;
        let dragEventDummy: any;
        const userDefinedAction: string = 'someAction';
        const userDefinedData: any = { someKey: 'someValue' };
        const userDefinedGrouping: string = 'someGrouping';
        beforeEach(() => {
            const draggable: Wrapper<Vue> = getDraggableDirective(true, { dragData: userDefinedData, grouping: userDefinedGrouping, action: userDefinedAction });
            droppable = getDroppableDirective(true, { acceptedActions: [userDefinedAction] }, '<div>content</div>');
            dragEventDummy = getEventDummy();
            draggable.trigger('dragstart', dragEventDummy);
            droppable.trigger('dragover', dragEventDummy);
        });

        it('should cleanup element when changing from a droppable container to another', () => {
            (isInElement as jest.Mock).mockImplementationOnce(() => true);
            const secondDroppable: Wrapper<Vue> = getDroppableDirective(true, { acceptedActions: [userDefinedAction] });
            const droppablePlugin: MDroppable = MDOMPlugin.get(MDroppable, droppable.element)!;
            jest.spyOn(droppablePlugin, 'cleanupCssClasses');

            secondDroppable.trigger('dragenter', dragEventDummy);
            droppable.trigger('dragenter', dragEventDummy);
            droppable.trigger('dragleave', dragEventDummy);

            expect(MDroppable.previousHoverContainer).toBe(droppablePlugin);
            expect(MDroppable.currentHoverDroppable).toBeUndefined();
            expect(droppablePlugin.cleanupCssClasses).toHaveBeenCalled();
        });

        it('should manage events correctly when changing from a droppable container to another', () => {
            const dropEventDummy: any = getEventDummy();

            const secondDroppable: Wrapper<Vue> = getDroppableDirective(true, { acceptedActions: [userDefinedAction] });
            secondDroppable.trigger('dragenter', dragEventDummy);
            droppable.trigger('dragenter', dragEventDummy);
            droppable.trigger('dragleave', dragEventDummy);

            const event: any = droppable.emitted(MDroppableEventNames.OnDragLeave)[0][0];
            expect(event.dropInfo).toEqual({ action: userDefinedAction, grouping: userDefinedGrouping, data: userDefinedData, canDrop: true });
        });

        it('should cleanup element when mouse is leaving a droppable container', () => {
            const droppablePlugin: MDroppable = MDOMPlugin.get(MDroppable, droppable.element)!;
            jest.spyOn(droppablePlugin, 'cleanupCssClasses');

            droppable.trigger('dragenter', dragEventDummy);
            droppable.trigger('dragleave', dragEventDummy);

            expect(MDroppable.previousHoverContainer).toBe(droppablePlugin);
            expect(MDroppable.currentHoverDroppable).toBeUndefined();
            expect(droppablePlugin.cleanupCssClasses).toHaveBeenCalled();
        });

        it('should manage events correctly when mouse is leaving a droppable container', () => {
            droppable.trigger('dragenter', dragEventDummy);
            droppable.trigger('dragleave', dragEventDummy);

            const event: any = droppable.emitted(MDroppableEventNames.OnDragLeave)[0][0];
            expect(event.dropInfo).toEqual({ action: userDefinedAction, grouping: userDefinedGrouping, data: userDefinedData, canDrop: true });
        });
    });

    [{
        privateHandlerName: 'onDragEnter',
        associatedNativeDomEvent: 'dragenter',
        shouldEmit: MDroppableEventNames.OnDragEnter
    }, {
        privateHandlerName: 'onDragOver',
        associatedNativeDomEvent: 'dragover',
        shouldEmit: MDroppableEventNames.OnDragOver
    }].forEach(eventSpec => {
        let droppable: Wrapper<Vue>;
        let dragEventDummy: any;
        const userDefinedAction: string = 'someAction';
        const userDefinedData: any = { someKey: 'someValue' };
        const userDefinedGrouping: string = 'someGrouping';

        const mockCanDrop: (wrapper: Wrapper<Vue>, value: boolean) => void = (_wrapper: Wrapper<Vue>, value: boolean) => {
            const plugin: MDroppable = MDOMPlugin.get(MDroppable, droppable.element)!;
            plugin.canDrop = jest.fn();
            (plugin.canDrop as jest.Mock).mockImplementation(() => value);
        };

        beforeEach(() => {
            const draggable: Wrapper<Vue> = getDraggableDirective(true, { dragData: userDefinedData, grouping: userDefinedGrouping, action: userDefinedAction });
            droppable = getDroppableDirective(true, { acceptedActions: [userDefinedAction] });
            dragEventDummy = getEventDummy();
            draggable.trigger('dragstart', dragEventDummy);
        });

        describe(eventSpec.privateHandlerName, () => {
            [{
                canDrop: true,
                expectedClass: MDroppableClassNames.CanDrop,
                expectedDropEffect: MDropEffect.MMove
            }, {
                canDrop: false,
                expectedClass: MDroppableClassNames.CantDrop,
                expectedDropEffect: MDropEffect.MNone
            }].forEach(combination => {
                it(`should update element correctly when canDrop is ${combination.canDrop}`, () => {
                    const plugin: MDroppable = MDOMPlugin.get(MDroppable, droppable.element)!;
                    mockCanDrop(droppable, combination.canDrop);
                    jest.spyOn(plugin, 'cleanupCssClasses');

                    droppable.trigger(eventSpec.associatedNativeDomEvent, dragEventDummy);

                    expect(plugin.cleanupCssClasses).toHaveBeenCalled();
                    expect(droppable.element.classList).toContain(MDroppableClassNames.Droppable);
                    expect(droppable.element.classList).toContain(combination.expectedClass);
                    expect(droppable.element.classList).toContain(MDroppableClassNames.Overing);
                });
            });

            it('should manage DragEvent correctly when canDrop is false', () => {
                mockCanDrop(droppable, false);
                const dropEventDummy: any = getEventDummy();
                jest.spyOn(dropEventDummy, 'preventDefault');

                droppable.trigger(eventSpec.associatedNativeDomEvent, dropEventDummy);

                const event: any = droppable.emitted(eventSpec.shouldEmit)[0][0];
                expect(event.dropInfo).toEqual({ action: userDefinedAction, grouping: userDefinedGrouping, data: userDefinedData, canDrop: false });
            });

            it('should manage DragEvent correctly when canDrop is true', () => {
                mockCanDrop(droppable, true);
                const dropEventDummy: any = getEventDummy();
                jest.spyOn(dropEventDummy, 'preventDefault');

                droppable.trigger(eventSpec.associatedNativeDomEvent, dropEventDummy);

                const event: any = droppable.emitted(eventSpec.shouldEmit)[0][0];
                expect(event.dropInfo).toEqual({ action: userDefinedAction, grouping: userDefinedGrouping, data: userDefinedData, canDrop: true });
            });
        });

        it('should emit MDroppableEventNames.onDragEnter only once when multiple dragEnter occurs on a droppable', () => {
            if (eventSpec.shouldEmit === MDroppableEventNames.OnDragOver) { return; }

            droppable.trigger(eventSpec.associatedNativeDomEvent, dragEventDummy);
            droppable.trigger(eventSpec.associatedNativeDomEvent, dragEventDummy);
            droppable.trigger(eventSpec.associatedNativeDomEvent, dragEventDummy);

            expect(droppable.emitted(eventSpec.shouldEmit)).toHaveLength(1);
        });
    });

    describe('onDrop', () => {
        let droppable: Wrapper<Vue>;
        let dragEventDummy: any;
        const userDefinedAction: string = 'someAction';
        const userDefinedData: any = { someKey: 'someValue' };
        const userDefinedGrouping: string = 'someGrouping';
        beforeEach(() => {
            const draggable: Wrapper<Vue> = getDraggableDirective(true, { dragData: userDefinedData, grouping: userDefinedGrouping, action: userDefinedAction });
            droppable = getDroppableDirective(true, { acceptedActions: [userDefinedAction] });
            dragEventDummy = getEventDummy();
            draggable.trigger('dragstart', dragEventDummy);
            droppable.trigger('dragover', dragEventDummy);
        });

        it('should update element correctly', () => {
            const droppablePlugin: MDroppable = MDOMPlugin.get(MDroppable, droppable.element)!;
            jest.spyOn(droppablePlugin, 'cleanupCssClasses');

            droppable.trigger('drop', dragEventDummy);

            expect(droppablePlugin.cleanupCssClasses).toHaveBeenCalled();
            expect(MDroppable.currentHoverDroppable).toBeUndefined();
        });

        it('should manage DragEvent correctly', () => {
            const dropEventDummy: any = getEventDummy();
            jest.spyOn(dropEventDummy, 'stopPropagation');
            jest.spyOn(dropEventDummy, 'preventDefault');

            droppable.trigger('drop', dropEventDummy);

            const event: any = droppable.emitted(MDroppableEventNames.OnDrop)[0][0];
            expect(event.dropInfo).toEqual({ action: userDefinedAction, grouping: userDefinedGrouping, data: userDefinedData, canDrop: true });
        });
    });

    describe('cleanupCssClasses', () => {
        let droppable: Wrapper<Vue>;
        beforeEach(() => {
            const draggable: Wrapper<Vue> = getDraggableDirective(true);
            droppable = getDroppableDirective(true);
        });

        const addClass: (className: string) => void = (className: string) => {
            if (!droppable.element.classList.contains(className)) {
                droppable.element.classList.add(className);
            }
        };

        it('should never clean up Droppable class', () => {
            addClass(MDroppableClassNames.Droppable);
            const droppablePlugin: MDroppable = MDOMPlugin.get(MDroppable, droppable.element)!;

            droppablePlugin.cleanupCssClasses();

            expect(droppable.element.classList).toContain(MDroppableClassNames.Droppable);
        });

        [MDroppableClassNames.CanDrop, MDroppableClassNames.CantDrop, MDroppableClassNames.Overing].forEach(className => {
            it(`should clean up ${className} class when it exists on element`, () => {
                addClass(className);
                const droppablePlugin: MDroppable = MDOMPlugin.get(MDroppable, droppable.element)!;

                droppablePlugin.cleanupCssClasses();

                expect(droppable.element.classList).not.toContain(className);
            });
        });
    });

    describe('canDrop', () => {
        let draggable: Wrapper<Vue>;
        let droppable: Wrapper<Vue>;
        let plugin: MDroppable;
        beforeEach(() => {
            draggable = getDraggableDirective(true);
            draggable.trigger('dragstart', getEventDummy());

            droppable = getDroppableDirective(true);
            plugin = MDOMPlugin.get(MDroppable, droppable.element)!;
        });

        it('should return false when currentDraggable is undefined', () => {
            MDraggable.currentDraggable = undefined;

            const returnValue: boolean = plugin.canDrop();

            expect(returnValue).toBeFalsy();
        });

        it('should return false droppable binding is false', () => {
            plugin.options.canDrop = false;

            const returnValue: boolean = plugin.canDrop();

            expect(returnValue).toBeFalsy();
        });

        it('should return false if draggable action is not accepted by droppable', () => {
            const draggablePlugin: MDraggable = MDOMPlugin.get(MDraggable, draggable.element)!;
            draggablePlugin.options.action = 'wontBeAcceptedByDroppable';
            plugin.options.acceptedActions = ['iWontAcceptAnything'];

            const returnValue: boolean = plugin.canDrop();

            expect(returnValue).toBeFalsy();
        });

        it('should return false if current droppable is dragging element', () => {
            const element: Wrapper<Vue> = mount({
                template: `<div v-m-droppable v-m-draggable :drag-data="'something'"></div>`
            }, { localVue: Vue });
            element.trigger('dragstart', getEventDummy());
            element.trigger('dragover', getEventDummy());

            const returnValue: boolean = plugin.canDrop();

            expect(returnValue).toBeFalsy();
        });

        it('should return false if current droppable is dragging elements child', () => {
            const element: Wrapper<Vue> = mount({
                template: `
                    <div v-m-draggable :drag-data="'something'">
                        <div class="someChild" v-m-droppable>SomeChild</div>
                    </div>`
            }, { localVue: Vue });
            const child: Wrapper<Vue> = element.find('.someChild');
            element.trigger('dragstart', getEventDummy());
            child.trigger('dragover', getEventDummy());

            const returnValue: boolean = plugin.canDrop();

            expect(returnValue).toBeFalsy();
        });

        it('should return true when everything is ok', () => {
            const returnValue: boolean = plugin.canDrop();

            expect(returnValue).toBeTruthy();
        });
    });

    ['mousedown', 'touchstart'].forEach(eventName => {
        it(`should apply MRemoveUserSelect on ${eventName}`, () => {
            mockTargetIsInput = false;

            const droppable: Wrapper<Vue> = getDroppableDirective(true);
            droppable.trigger(eventName);

            expect(MDOMPlugin.get(MRemoveUserSelect, droppable.element)).toBeDefined();
        });

        it(`should not apply MRemoveUserSelect on ${eventName} when the event target is an input`, () => {
            mockTargetIsInput = true;

            const droppable: Wrapper<Vue> = getDroppableDirective(true);
            droppable.trigger(eventName);

            expect(MDOMPlugin.get(MRemoveUserSelect, droppable.element)).toBeUndefined();
        });
    });
});
