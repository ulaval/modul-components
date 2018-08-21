import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';

import { resetModulPlugins } from './../../../tests/helpers/component';
import { polyFillActive } from './../../utils/polyfills';
import { MDOMPlugin } from './../domPlugin';
import { MRemoveUserSelect } from './../user-select/remove-user-select';
import DraggablePlugin, { MDraggable, MDraggableClassNames, MDraggableEventNames, MDraggableOptions } from './draggable';

jest.useFakeTimers();
let mockTargetIsInput: boolean = false;
jest.mock('../../utils/event/event', () => ({ targetIsInput(): boolean { return mockTargetIsInput; } }));

beforeEach(() => {
    mockTargetIsInput = false;
});

describe('draggable', () => {
    polyFillActive.dragDrop = false;

    const dragImageTemplate: string = `<div class="${MDraggableClassNames.DragImage}"></div>`;
    const getDraggableDirective: (bindingValue?: boolean, options?: MDraggableOptions, innerHtml?: string) => Wrapper<Vue> =
    (bindingValue?: boolean, options?: MDraggableOptions, innerHtml?: string) => {
        let directive: Wrapper<Vue>;
        if (options) {
            directive = mount({
                template: bindingValue === undefined ? `<div v-m-draggable :action="action" :drag-data="dragData" :grouping="grouping">${innerHtml || ''}</div>`
                    : `<div v-m-draggable="${bindingValue}" :action="action" :drag-data="dragData" :grouping="grouping">${innerHtml || ''}</div>`,
                data: () => options
            }, { localVue: Vue });
        } else {
            directive = mount({
                template: bindingValue === undefined ? `<div v-m-draggable>${innerHtml || ''}</div>`
                    : `<div v-m-draggable="${bindingValue}">${innerHtml || ''}</div>`
            }, { localVue: Vue });
        }

        Object.keys(MDraggableEventNames).forEach(key => directive.vm.$listeners[MDraggableEventNames[key]] = () => {});
        return directive;
    };

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(DraggablePlugin);
    });

    [true, undefined].forEach(param => {
        it(`it should render correctly when binding ${param} is provided`, () => {
            const userDefinedAction: string = 'someAction';
            const userDefinedData: string = 'someData';
            const userDefinedGrouping: string = 'someGrouping';
            const draggable: Wrapper<Vue> = getDraggableDirective(param, { dragData: userDefinedData, action: userDefinedAction, grouping: userDefinedGrouping });

            expect(draggable.element.classList).toContain(MDraggableClassNames.Draggable);
            expect(MDOMPlugin.get(MDraggable, draggable.element).options.action).toBe(userDefinedAction);
            expect(MDOMPlugin.get(MDraggable, draggable.element).options.dragData).toBe(userDefinedData);
            expect(draggable.element.draggable).toBe(true);
            expect(MDOMPlugin.get(MRemoveUserSelect, draggable.element)).toBeDefined();
        });
        it(`it should default action correctly when binding ${param} is provided and action is not user defined`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective(param);
            expect(MDOMPlugin.get(MDraggable, draggable.element).options.action).toBe('any');
        });
    });

    it('it should render correctly when binding false is provided', () => {
        const draggable: Wrapper<Vue> = getDraggableDirective(false);

        expect(draggable.element.classList).not.toContain(MDraggableClassNames.Draggable);
        expect(draggable.element.draggable).toBeUndefined();
        expect(MDOMPlugin.get(MDraggable, draggable.element)).toBeUndefined();
        expect(MDOMPlugin.get(MRemoveUserSelect, draggable.element)).toBeUndefined();
    });

    [undefined, true, false].forEach(param => {
        it(`it should manage drag image correctly when binding ${param} is provided`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective(param, undefined, dragImageTemplate);

            const dragImage: HTMLElement = draggable.find('.dragImage').element;
            expect(dragImage.style.left).toBe('-9999px');
            expect(dragImage.style.top).toBe('-9999px');
            expect(dragImage.style.position).toBe('absolute');
            expect(dragImage.style.overflow).toBe('hidden');
            expect(dragImage.style.zIndex).toBe('1');
            expect(dragImage.hidden).toBeTruthy();
        });
    });

    ['mousedown', 'touchstart'].forEach(eventName => {
        it(`it should add grabbing class on ${eventName}`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective();
            draggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(draggable.element.classList).toContain(MDraggableClassNames.Grabbing);
            expect(MDraggable.currentDraggable).toBeUndefined();
        });

        it(`it should apply MRemoveUserSelect on ${eventName}`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective();
            draggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(MDOMPlugin.get(MRemoveUserSelect, draggable.element)).toBeDefined();
        });

        it(`it should not apply grabbing class on ${eventName} when the event target is an input`, () => {
            mockTargetIsInput = true;

            const draggable: Wrapper<Vue> = getDraggableDirective();
            draggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(draggable.element.classList).not.toContain(MDraggableClassNames.Grabbing);
            expect(MDraggable.currentDraggable).toBeUndefined();
        });

        it(`it should not apply MRemoveUserSelect on ${eventName} when the event target is an input`, () => {
            mockTargetIsInput = true;

            const draggable: Wrapper<Vue> = getDraggableDirective();
            draggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(MDOMPlugin.get(MRemoveUserSelect, draggable.element)).toBeUndefined();
        });

        it(`it should not apply grabbing class to parent draggable on ${eventName} when draggable is nested into another draggable`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective(true, undefined, '<div class="childDraggable" v-m-draggable="true">child draggable</div>');
            const childDraggable: Wrapper<Vue> = draggable.find('.childDraggable');

            childDraggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(draggable.element.classList).not.toContain(MDraggableClassNames.Grabbing);
            expect(childDraggable.element.classList).toContain(MDraggableClassNames.Grabbing);
        });
    });

    ['mouseup', 'touchend', 'click', 'touchcancel'].forEach(eventName => {
        it(`it should remove grabbing class on document ${eventName}`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective();
            draggable.trigger('touchstart');
            draggable.trigger('touchend');

            expect(draggable.element.classList).not.toContain(MDraggableClassNames.Grabbing);
            expect(MDraggable.currentDraggable).toBeUndefined();
        });
    });

    describe('unbind', () => {
        it('should clean up element correctly', () => {
            const draggable: Wrapper<Vue> = getDraggableDirective(undefined, undefined, dragImageTemplate);
            const element: HTMLElement = draggable.element;
            const dragImage: HTMLElement = draggable.find(`.${MDraggableClassNames.DragImage}`).element;
            draggable.destroy();

            expect(element.draggable).toBeFalsy();
            expect(dragImage.hidden).toBeTruthy();
            expect(dragImage.classList).not.toContain(MDraggableClassNames.Draggable);
            expect(dragImage.classList).not.toContain(MDraggableClassNames.Dragging);
            expect(dragImage.classList).not.toContain(MDraggableClassNames.Grabbing);
            expect(MDOMPlugin.get(MRemoveUserSelect, element)).toBeUndefined();
        });

        it('should clean up events correctly', () => {
            const draggable: Wrapper<Vue> = getDraggableDirective(undefined, undefined, dragImageTemplate);
            const element: HTMLElement = draggable.element;
            const draggablePlugin: MDraggable = MDOMPlugin.get(MDraggable, element);
            jest.spyOn(draggablePlugin, 'removeAllEvents');
            draggable.destroy();

            expect(draggablePlugin.removeAllEvents).toHaveBeenCalled();
        });
    });

    describe('onDragStart', () => {
        let draggable: Wrapper<Vue>;
        const userDefinedAction: string = 'someAction';
        const userDefinedData: any = { someKey: 'someValue' };
        const userDefinedGrouping: string = 'someGrouping';
        beforeEach(() => {
            draggable = getDraggableDirective(true, {
                action: userDefinedAction,
                dragData: userDefinedData,
                grouping: userDefinedGrouping
            }, dragImageTemplate);
        });

        it('it should update element correctly', () => {
            const options: any = { stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
            draggable.trigger('dragstart', options);

            expect(MDraggable.currentDraggable).toBe(MDOMPlugin.get(MDraggable, draggable.element));
            expect(draggable.element.classList).toContain(MDraggableClassNames.Draggable);
            expect(draggable.element.classList).toContain(MDraggableClassNames.Dragging);
        });

        it('it should manage DragEvent correctly', () => {
            const options: any = { stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
            jest.spyOn(options, 'stopPropagation');
            draggable.trigger('dragstart', options);

            const event: any = draggable.emitted(MDraggableEventNames.OnDragStart)[0][0];
            expect(options.stopPropagation).toHaveBeenCalled();
            expect(event.dragInfo).toBeDefined();
            expect(event.dragInfo).toEqual({ action: userDefinedAction, data: userDefinedData, grouping: userDefinedGrouping });
        });

        it('should populate dataTransfer correctly', () => {
            const options: any = { stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
            jest.spyOn(options.dataTransfer, 'setData');
            jest.spyOn(options.dataTransfer, 'setDragImage');
            draggable.trigger('dragstart', options);

            const dragImage: HTMLElement = draggable.find(`.${MDraggableClassNames.DragImage}`).element;
            expect(options.dataTransfer.setData).toHaveBeenCalledWith('application/json', JSON.stringify(userDefinedData));
            expect(options.dataTransfer.setDragImage).toHaveBeenCalledWith(dragImage, 0, 0);
        });

        ['mousedown', 'touchstart'].forEach(eventName => {
            it(`it should do nothing if the user triggered ${eventName} in an input before dragStart`, () => {
                mockTargetIsInput = true;
                draggable.trigger(eventName);

                const options: any = { stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
                draggable.trigger('dragend', options);

                const event: any = draggable.emitted(MDraggableEventNames.OnDragStart);
                expect(MDraggable.currentDraggable).toBeUndefined();
                expect(draggable.element.classList).toContain(MDraggableClassNames.Draggable);
                expect(draggable.element.classList).not.toContain(MDraggableClassNames.Dragging);
                expect(event).toBeUndefined();
            });
        });
    });

    describe('onDragEnd', () => {
        let draggable: Wrapper<Vue>;
        const userDefinedAction: string = 'someAction';
        const userDefinedData: any = { someKey: 'someValue' };
        const userDefinedGrouping: string = 'someGrouping';
        beforeEach(() => {
            draggable = getDraggableDirective(true, {
                action: userDefinedAction,
                dragData: userDefinedData,
                grouping: userDefinedGrouping
            }, dragImageTemplate);

            const options: any = { stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
            draggable.trigger('dragstart', options);
        });

        it('it should update element correctly', () => {
            const options: any = { stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
            draggable.trigger('dragend', options);

            expect(MDraggable.currentDraggable).toBeUndefined();
            expect(draggable.element.classList).toContain(MDraggableClassNames.Draggable);
            expect(draggable.element.classList).not.toContain(MDraggableClassNames.Dragging);
        });

        it('it should manage DragEvent correctly', () => {
            const options: any = { stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
            jest.spyOn(options, 'stopPropagation');
            draggable.trigger('dragend', options);

            const event: any = draggable.emitted(MDraggableEventNames.OnDragEnd)[0][0];
            expect(options.stopPropagation).toHaveBeenCalled();
            expect(event.dragInfo).toBeDefined();
            expect(event.dragInfo).toEqual({ action: userDefinedAction, data: userDefinedData, grouping: userDefinedGrouping });
        });

        ['mousedown', 'touchstart'].forEach(eventName => {
            it(`it should do nothing if the user triggered ${eventName} in an input before dragEnd`, () => {
                mockTargetIsInput = true;
                draggable.trigger(eventName);

                const options: any = { stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
                draggable.trigger('dragend', options);

                expect(MDraggable.currentDraggable).toBeDefined();
                expect(draggable.element.classList).toContain(MDraggableClassNames.Draggable);
                expect(draggable.element.classList).toContain(MDraggableClassNames.Dragging);
            });
        });
    });
});
