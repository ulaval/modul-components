import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { resetModulPlugins } from './../../../../tests/helpers/component';
import { polyFillActive } from './../../../utils/polyfills';
import { MDOMPlugin } from './../../domPlugin';
import { MRemoveUserSelect } from './../../user-select/remove-user-select';
import DraggablePlugin, { MDraggable, MDraggableClassNames, MDraggableEventNames, MDraggableOptions } from './draggable';

jest.useFakeTimers();
let mockTargetIsInput: boolean = false;

jest.mock('../../../utils/event/event', () => ({
    targetIsInput(): boolean { return mockTargetIsInput; }
}));

const WIDTH: number = 100;
const HEIGHT: number = 200;

let spyWindow: jest.SpyInstance<any> = jest.spyOn(window, 'getComputedStyle');
let element: jest.Mock = jest.fn();
element.mockReturnValue({ classList: jest.fn(), querySelector: jest.fn() });

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
    element.mockReset();
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
                    data: () => options,
                    computed: {
                        element: element
                    }
                }, { localVue: Vue });
            } else {
                directive = mount({
                    template: bindingValue === undefined ? `<div v-m-draggable>${innerHtml || ''}</div>`
                        : `<div v-m-draggable="${bindingValue}">${innerHtml || ''}</div>`,
                    computed: {
                        element: element
                    }
                }, { localVue: Vue });
            }

            return directive;
        };

    beforeEach(() => {
        resetModulPlugins();
        Vue.use(DraggablePlugin);
    });

    [true, undefined].forEach(param => {
        it(`should render correctly when binding ${param} is provided`, () => {
            const userDefinedAction: string = 'someAction';
            const userDefinedData: string = 'someData';
            const userDefinedGrouping: string = 'someGrouping';
            const draggable: Wrapper<Vue> = getDraggableDirective(param, { dragData: userDefinedData, action: userDefinedAction, grouping: userDefinedGrouping });

            expect(draggable.element.classList).toContain(MDraggableClassNames.Draggable);
            expect(MDOMPlugin.get(MDraggable, draggable.element)!.options.action).toBe(userDefinedAction);
            expect(MDOMPlugin.get(MDraggable, draggable.element)!.options.dragData).toBe(userDefinedData);
            expect(draggable.element.draggable).toBe(true);
            expect(MDOMPlugin.get(MRemoveUserSelect, draggable.element)).toBeDefined();
        });
        it(`should default action correctly when binding ${param} is provided and action is not user defined`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective(param);
            expect(MDOMPlugin.get(MDraggable, draggable.element)!.options.action).toBe('any');
        });
    });

    it('should render correctly when binding false is provided', () => {
        const draggable: Wrapper<Vue> = getDraggableDirective(false);

        expect(draggable.element.classList).not.toContain(MDraggableClassNames.Draggable);
        expect(draggable.element.draggable).toBeUndefined();
        expect(MDOMPlugin.get(MDraggable, draggable.element)).toBeUndefined();
        expect(MDOMPlugin.get(MRemoveUserSelect, draggable.element)).toBeUndefined();
    });

    [undefined, true, false].forEach(param => {
        it(`should manage drag image correctly when binding ${param} is provided`, () => {
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
        it(`should add grabbing class on ${eventName}`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective();
            draggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(draggable.element.classList).toContain(MDraggableClassNames.Grabbing);
            expect(MDraggable.currentDraggable).toBeUndefined();
        });

        it(`should apply MRemoveUserSelect on ${eventName}`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective();
            draggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(MDOMPlugin.get(MRemoveUserSelect, draggable.element)).toBeDefined();
        });

        it(`should not apply grabbing class on ${eventName} when the event target is an input`, () => {
            mockTargetIsInput = true;

            const draggable: Wrapper<Vue> = getDraggableDirective();
            draggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(draggable.element.classList).not.toContain(MDraggableClassNames.Grabbing);
            expect(MDraggable.currentDraggable).toBeUndefined();
        });

        it(`should not apply MRemoveUserSelect on ${eventName} when the event target is an input`, () => {
            mockTargetIsInput = true;

            const draggable: Wrapper<Vue> = getDraggableDirective();
            draggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(MDOMPlugin.get(MRemoveUserSelect, draggable.element)).toBeUndefined();
        });

        it(`should not apply grabbing class to parent draggable on ${eventName} when draggable is nested into another draggable`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective(true, undefined, '<div class="childDraggable" v-m-draggable="true">child draggable</div>');
            const childDraggable: Wrapper<Vue> = draggable.find('.childDraggable');

            childDraggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(draggable.element.classList).not.toContain(MDraggableClassNames.Grabbing);
            expect(childDraggable.element.classList).toContain(MDraggableClassNames.Grabbing);
        });

        it(`should not apply grabbing class to parent draggable on ${eventName} when draggable is nested into another draggable`, () => {
            const draggable: Wrapper<Vue> = getDraggableDirective(true, undefined, '<div class="childDraggable" v-m-draggable="true">child draggable</div>');
            const childDraggable: Wrapper<Vue> = draggable.find('.childDraggable');

            childDraggable.trigger(eventName);
            jest.runOnlyPendingTimers();

            expect(draggable.element.classList).not.toContain(MDraggableClassNames.Grabbing);
            expect(childDraggable.element.classList).toContain(MDraggableClassNames.Grabbing);
        });

        describe(`Given a draggable element with no handle`, () => {
            describe(`When ${eventName}`, () => {
                it(`Then it should apply grabbing class to parent draggable`, () => {
                    const draggable: Wrapper<Vue> = getDraggableDirective(undefined, undefined, '<div class="draggableContent">draggable content</div>');

                    draggable.trigger(eventName);
                    jest.runOnlyPendingTimers();

                    expect(draggable.element.classList).toContain(MDraggableClassNames.Grabbing);
                });
            });
        });

        describe(`Given a draggable element with handle`, () => {
            describe(`When ${eventName} and the handle is not used`, () => {
                it(`Then it should not apply grabbing class to parent draggable`, () => {
                    const draggable: Wrapper<Vue> = getDraggableDirective(undefined, undefined, '<div class="drag-handle">Handle</div><div class="draggableContent">draggable content</div>');
                    const draggableContent: Wrapper<Vue> = draggable.find('.draggableContent');

                    draggableContent.trigger(eventName);
                    jest.runOnlyPendingTimers();

                    expect(draggable.element.classList).not.toContain(MDraggableClassNames.Grabbing);
                });
            });
        });

        describe(`Given a draggable element with handle`, () => {
            describe(`When ${eventName} and the handle is used`, () => {
                it(`Then it should apply grabbing class to parent draggable`, () => {
                    const draggable: Wrapper<Vue> = getDraggableDirective(undefined, undefined, '<div class="drag-handle">Handle</div><div class="draggableContent">draggable content</div>');
                    const draggableHandle: Wrapper<Vue> = draggable.find('.drag-handle');

                    draggableHandle.trigger(eventName);
                    jest.runOnlyPendingTimers();

                    expect(draggable.element.classList).toContain(MDraggableClassNames.Grabbing);
                });
            });
        });
    });

    ['mouseup', 'touchend', 'click', 'touchcancel'].forEach(eventName => {
        it(`should remove grabbing class on document ${eventName}`, () => {
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

            const draggablePlugin: MDraggable | undefined = MDOMPlugin.get(MDraggable, element);
            if (draggablePlugin) {
                jest.spyOn(draggablePlugin, 'removeAllEvents');
                draggable.destroy();

                expect(draggablePlugin.removeAllEvents).toHaveBeenCalled();
            } else {
                fail('draggablePlugin is undefined');
            }
        });
    });

    describe('onDragStart', () => {
        let draggable: Wrapper<Vue>;
        const userDefinedAction: string = 'someAction';
        const userDefinedData: any = { someKey: 'someValue' };
        const userDefinedGrouping: string = 'someGrouping';
        beforeEach(() => {
            polyFillActive.dragDrop = false;
            draggable = getDraggableDirective(true, {
                action: userDefinedAction,
                dragData: userDefinedData,
                grouping: userDefinedGrouping
            }, dragImageTemplate);
        });

        it('should update element correctly', () => {
            const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
            draggable.trigger('dragstart', options);

            expect(MDraggable.currentDraggable).toBe(MDOMPlugin.get(MDraggable, draggable.element));
            expect(draggable.element.classList).toContain(MDraggableClassNames.Draggable);
            expect(draggable.element.classList).toContain(MDraggableClassNames.Dragging);
        });

        it('should manage DragEvent correctly', () => {
            const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
            jest.spyOn(options, 'stopPropagation');
            draggable.trigger('dragstart', options);

            const event: any = draggable.emitted(MDraggableEventNames.OnDragStart)[0][0];
            expect(event.dragInfo).toBeDefined();
            expect(event.dragInfo).toEqual({ action: userDefinedAction, data: userDefinedData, grouping: userDefinedGrouping });
        });

        it('should populate dataTransfer correctly', () => {
            const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
            jest.spyOn(options.dataTransfer, 'setData');
            jest.spyOn(options.dataTransfer, 'setDragImage');

            draggable.trigger('dragstart', options);

            const dragImage: HTMLElement = draggable.find(`.${MDraggableClassNames.DragImage}`).element;
            expect(options.dataTransfer.setData).toHaveBeenCalledWith('application/json', JSON.stringify(userDefinedData));
            expect(options.dataTransfer.setDragImage).toHaveBeenCalledWith(dragImage, 0, 0);
        });

        describe(`With no dragImage defined`, () => {
            it('should use the default ghost image and not set a custom dragImage', () => {
                element.mockReturnValue({ classList: jest.fn(), querySelector: undefined });
                draggable = getDraggableDirective(true, {
                    action: userDefinedAction,
                    dragData: userDefinedData,
                    grouping: userDefinedGrouping
                });
                const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
                jest.spyOn(options.dataTransfer, 'setData');
                jest.spyOn(options.dataTransfer, 'setDragImage');

                draggable.trigger('dragstart', options);

                const dragImage: HTMLElement = draggable.find(`.${MDraggableClassNames.DragImage}`).element;
                expect(options.dataTransfer.setDragImage).toHaveBeenCalledTimes(0);
            });
        });

        describe(`With dragImage defined`, () => {
            describe(`With mobile drag & drop polyfill active`, () => {
                it('should set a custom dragImage with offsets set to 0', () => {
                    polyFillActive.dragDrop = true;
                    const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
                    jest.spyOn(options.dataTransfer, 'setDragImage');

                    draggable.trigger('touchmove');
                    draggable.trigger('dragstart', options);

                    const dragImage: HTMLElement = draggable.find(`.${MDraggableClassNames.DragImage}`).element;
                    expect(options.dataTransfer.setDragImage).toHaveBeenCalledWith(dragImage, 0, 0);
                });
            });

            describe(`On desktop`, () => {
                it('should set a custom dragImage with offsets set to half the width and height', () => {
                    spyWindow.mockReturnValue({ width: WIDTH, height: HEIGHT });
                    const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
                    jest.spyOn(options.dataTransfer, 'setDragImage');

                    draggable.trigger('dragstart', options);

                    const dragImage: HTMLElement = draggable.find(`.${MDraggableClassNames.DragImage}`).element;
                    expect(options.dataTransfer.setDragImage).toHaveBeenCalledWith(dragImage, WIDTH / 2, HEIGHT / 2);
                });
            });
        });

        ['mousedown', 'touchstart'].forEach(eventName => {
            it(`should do nothing if the user triggered ${eventName} in an input before dragStart`, () => {
                mockTargetIsInput = true;
                draggable.trigger(eventName);

                const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
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

            const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
            draggable.trigger('dragstart', options);
        });

        it('should update element correctly', () => {
            const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
            draggable.trigger('dragend', options);

            expect(MDraggable.currentDraggable).toBeUndefined();
            expect(draggable.element.classList).toContain(MDraggableClassNames.Draggable);
            expect(draggable.element.classList).not.toContain(MDraggableClassNames.Dragging);
        });

        it('should manage DragEvent correctly', () => {
            const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
            jest.spyOn(options, 'stopPropagation');
            draggable.trigger('dragend', options);

            const event: any = draggable.emitted(MDraggableEventNames.OnDragEnd)[0][0];
            expect(event.dragInfo).toBeDefined();
            expect(event.dragInfo).toEqual({ action: userDefinedAction, data: userDefinedData, grouping: userDefinedGrouping });
        });

        ['mousedown', 'touchstart'].forEach(eventName => {
            it(`should do nothing if the user triggered ${eventName} in an input before dragEnd`, () => {
                mockTargetIsInput = true;
                draggable.trigger(eventName);

                const options: any = { stopPropagation: () => { }, dataTransfer: { setData: () => { }, setDragImage: () => { }, getData: () => { } } };
                draggable.trigger('dragend', options);

                expect(MDraggable.currentDraggable).toBeDefined();
                expect(draggable.element.classList).toContain(MDraggableClassNames.Draggable);
                expect(draggable.element.classList).toContain(MDraggableClassNames.Dragging);
            });
        });
    });
});
