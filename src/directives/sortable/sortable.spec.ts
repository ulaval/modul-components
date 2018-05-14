import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { polyFillActive } from '../../utils/polyfills';
import { ModulVue } from '../../utils/vue/vue';
import { MDraggable, MDraggableEventNames, MDraggableOptions } from '../draggable/draggable';
import { MDroppable } from '../droppable/droppable';
import DroppableGroupPlugin from '../droppable/droppable-group';
import { MDOMPlugin } from './../domPlugin';
import { MDraggableClassNames } from './../draggable/draggable';
import { MSortableDefaultInsertionMarkerBehavior } from './insertion-behavior';
import SortablePlugin, { MSortable, MSortableAction, MSortableClassNames, MSortableEventNames, MSortableOptions, MSortInsertPositions } from './sortable';

jest.mock('./insertion-behavior');
describe('sortable', () => {
    polyFillActive.dragDrop = false;

    const emptyPlaceholderTemplate: string = `<li v-for="item in items" v-if="items.length">Item #{{ $index }}</li>`;
    const getSortableDirective: (bindingValue?: boolean, options?: MSortableOptions, innerHtml?: string) => Wrapper<Vue> =
    (bindingValue?: boolean, options?: MSortableOptions, innerHtml?: string) => {
        const innerHTML: string = `${innerHtml || emptyPlaceholderTemplate}`;
        let template: string;
        if (options) {
            template = bindingValue === undefined ? `<ul v-m-sortable :items="items" :accepted-actions="acceptedActions">${innerHTML}</ul>`
                    : `<ul v-m-sortable="${bindingValue}" :items="items" :accepted-actions="acceptedActions">${innerHTML}</ul>`;
        } else {
            template = bindingValue === undefined ? `<ul v-m-sortable>${innerHTML}</ul>`
                : `<ul v-m-sortable="${bindingValue}">${innerHTML}</ul>`;
        }

        let directive: Wrapper<Vue>;
        directive = mount({
            template,
            data: () => options || {}
        }, { localVue: Vue });

        Object.keys(MSortableEventNames).forEach(key => directive.vm.$listeners[MSortableEventNames[key]] = () => {});
        return directive;
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

        Object.keys(MDraggableEventNames).forEach(key => directive.vm.$listeners[MDraggableEventNames[key]] = () => {});
        return directive;
    };

    const getEventDummy: () => any = () => {
        return { preventDefault: () => {}, stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
    };

    const makeDroppable: (sortable: MSortable) => void = (sortable: MSortable) => {
        const droppablePart: MDroppable = MDOMPlugin.get(MDroppable, sortable.element);
        droppablePart.canDrop = jest.fn();
        (droppablePart.canDrop as jest.Mock).mockImplementation(() => true);
    };

    let localVue: VueConstructor<ModulVue>;
    beforeEach(() => {
        resetModulPlugins();
        Vue.use(SortablePlugin);
        Vue.use(DroppableGroupPlugin);
    });

    [true, undefined].forEach(param => {
        it(`it should render correctly when binding ${param} is provided`, () => {
            const userDefinedActions: string[] = ['a', 'b'];
            const userDefinedItems: any[] = [{ id: 0 }];
            const sortable: Wrapper<Vue> = getSortableDirective(param, { items: userDefinedItems, acceptedActions: userDefinedActions });

            expect(sortable.element.classList).toContain(MSortableClassNames.Sortable);
            expect(MDOMPlugin.get(MSortable, sortable.element).options.acceptedActions)
                .toEqual([...userDefinedActions, MSortableAction.Move, MSortableAction.MoveGroup]);
            expect(MDOMPlugin.get(MSortable, sortable.element).options.items).toBe(userDefinedItems);
            expect(MDOMPlugin.get(MDroppable, sortable.element)).toBeDefined();
        });

        it(`it should default action correctly when binding ${param} is provided and action is not user defined`, () => {
            const sortable: Wrapper<Vue> = getSortableDirective(param);

            expect(MDOMPlugin.get(MDroppable, sortable.element).options.acceptedActions)
                .toEqual([MSortableAction.Default, MSortableAction.Move, MSortableAction.MoveGroup]);
        });

        it('it should setup empty placeholder correctly', () => {
            const userDefinedActions: string[] = ['a', 'b'];
            const items: any[] = [{ id: 0 }];
            const sortable: Wrapper<Vue> =
                getSortableDirective(param, { acceptedActions: userDefinedActions, items: items }, `<div class="${MSortableClassNames.EmptyPlaceholder}"></div>`);

            expect(sortable.element.children[0].classList).toContain(MSortableClassNames.EmptyPlaceholder);
            expect(MDOMPlugin.get(MDraggable, sortable.element)).toBeUndefined();

            const droppablePlugin: MDroppable = MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement);
            expect(droppablePlugin).toBeDefined();
            expect(droppablePlugin.options).toEqual({
                canDrop: true,
                acceptedActions: [...userDefinedActions, MSortableAction.Move, MSortableAction.MoveGroup]
            });
        });

        it('it should setup childs droppable part correctly', () => {
            const userDefinedActions: string[] = ['a', 'b'];
            const items: any[] = [{ id: 0 }];
            const sortable: Wrapper<Vue> = getSortableDirective(param, { acceptedActions: userDefinedActions, items: items });

            const droppablePlugin: MDroppable = MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement);
            expect(droppablePlugin).toBeDefined();
            expect(droppablePlugin.options).toEqual({
                canDrop: true,
                acceptedActions: [...userDefinedActions, MSortableAction.Move, MSortableAction.MoveGroup]
            });
        });

        it('it should setup childs draggable part correctly', () => {
            const userDefinedActions: string[] = ['a', 'b'];
            const items: any[] = [{ id: 0 }];
            const sortable: Wrapper<Vue> = getSortableDirective(param, { acceptedActions: userDefinedActions, items: items });

            const draggablePlugin: MDraggable = MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement);
            expect(draggablePlugin).toBeDefined();
            expect(draggablePlugin.options).toEqual({
                canDrag: true,
                action: MSortableAction.Move,
                dragData: items[0]
            });
        });

        it('it should setup grouped childs droppable part correctly', () => {
            const userDefinedActions: string[] = ['a', 'b'];
            const items: any[] = [{ id: 0 }];
            const innerHtml: string = `<li v-for="item in items" v-if="items.length" v-m-droppable-group="1">Item #{{ $index }}</li>`;
            const sortable: Wrapper<Vue> = getSortableDirective(param, { acceptedActions: userDefinedActions, items: items }, innerHtml);

            const droppablePlugin: MDroppable = MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement);
            expect(droppablePlugin).toBeDefined();
            expect(droppablePlugin.options).toEqual({
                canDrop: true,
                acceptedActions: [...userDefinedActions, MSortableAction.Move, MSortableAction.MoveGroup]
            });
        });

        it('it should setup grouped childs draggable part correctly', () => {
            const userDefinedActions: string[] = ['a', 'b'];
            const userDefinedGroup: number = 1;
            const items: any[] = [{ id: 0 }];
            const innerHtml: string = `<li v-for="item in items" v-if="items.length" v-m-droppable-group="${userDefinedGroup}">Item #{{ $index }}</li>`;
            const sortable: Wrapper<Vue> = getSortableDirective(param, { acceptedActions: userDefinedActions, items: items }, innerHtml);

            const draggablePlugin: MDraggable = MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement);
            expect(draggablePlugin).toBeDefined();
            expect(draggablePlugin.options).toEqual({
                canDrag: true,
                action: MSortableAction.MoveGroup,
                dragData: items[0],
                grouping: userDefinedGroup
            });
        });
    });

    it('it should render correctly when binding false is provided', () => {
        const sortable: Wrapper<Vue> = getSortableDirective(false, { acceptedActions: ['someAction'], items: [{ id: 0 }] });

        expect(MDOMPlugin.get(MDroppable, sortable.element)).toBeUndefined();
        expect(MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
        expect(MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
    });

    it('it should not attach empty placeholder when binding false is provided', () => {
        const sortable: Wrapper<Vue> = getSortableDirective(false, undefined, `<div class="${MSortableClassNames.EmptyPlaceholder}">Some placeholder</div>`);

        expect(MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
        expect(MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
    });

    describe('unbind', () => {
        it('it should clean up element correctly', () => {
            const sortable: Wrapper<Vue> = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
            const plugin: MSortable = MDOMPlugin.get(MSortable, sortable.element);
            jest.spyOn(plugin, 'doCleanUp');

            sortable.destroy();

            expect(sortable.element.classList).not.toContain(MSortableClassNames.Sortable);
            expect(plugin.doCleanUp).toHaveBeenCalled();
            expect(MDOMPlugin.get(MDroppable, sortable.element)).toBeUndefined();
        });

        it('it should clean up empty placeholder when it exists', () => {
            const sortable: Wrapper<Vue> = getSortableDirective(true, undefined, `<div class="${MSortableClassNames.EmptyPlaceholder}">Some placeholder</div>`);

            sortable.destroy();

            expect(MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
            expect(MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
        });

        it('it should clean up childs correctly', () => {
            const sortable: Wrapper<Vue> = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
            const plugin: MSortable = MDOMPlugin.get(MSortable, sortable.element);

            sortable.destroy();

            expect(MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
            expect(MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
        });
    });

    describe('onDragEnter', () => {
        let sortable: Wrapper<Vue>;
        let secondSortable: Wrapper<Vue>;
        let plugin: MSortable;
        let secondPlugin: MSortable;

        beforeEach(() => {
            sortable = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
            plugin = MDOMPlugin.get(MSortable, sortable.element);
            makeDroppable(plugin);

            secondSortable = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
            secondPlugin = MDOMPlugin.get(MSortable, secondSortable.element);
            makeDroppable(secondPlugin);

            sortable.find(`.${MDraggableClassNames.Draggable}`).trigger('dragstart', getEventDummy());
        });

        it('it should handle event correctly', () => {
            const eventDummy: any = getEventDummy();
            sortable.find('li').trigger('dragenter', eventDummy);

            expect(MSortable.activeSortContainer).toBe(plugin);
        });

        it('it should handle transition from one active sortable to another', () => {
            sortable.find('li').trigger('dragenter', getEventDummy());
            jest.spyOn(plugin, 'doCleanUp');
            secondSortable.find('li').trigger('dragenter', getEventDummy());

            expect(plugin.doCleanUp).toHaveBeenCalled();
            expect(MSortable.activeSortContainer).toBe(MDOMPlugin.get(MSortable, secondSortable.element));
        });

        it('it should not call doCleanup more than 1 time on multiple trigger', () => {
            jest.spyOn(plugin, 'doCleanUp');
            MSortable.activeSortContainer = plugin;
            secondSortable.find('li').trigger('dragenter', getEventDummy());
            secondSortable.find('li').trigger('dragenter', getEventDummy());

            expect(plugin.doCleanUp).toHaveBeenCalledTimes(1);
        });

        it('it should transition to sort before class properly', () => {
            ((MSortableDefaultInsertionMarkerBehavior as any) as jest.Mock).mockImplementation(() => ({ getInsertPosition: () => MSortInsertPositions.After }));
            secondSortable.find('li').trigger('dragenter', getEventDummy());

            ((MSortableDefaultInsertionMarkerBehavior as any) as jest.Mock).mockImplementation(() => ({ getInsertPosition: () => MSortInsertPositions.Before }));
            secondSortable.find('li').trigger('dragenter', getEventDummy());

            expect(secondSortable.find('li').element.classList).toContain(MSortableClassNames.SortBefore);
            expect(secondSortable.find('li').element.classList).not.toContain(MSortableClassNames.SortAfter);
        });

        it('it should transition to sort after class properly', () => {
            ((MSortableDefaultInsertionMarkerBehavior as any) as jest.Mock).mockImplementation(() => ({ getInsertPosition: () => MSortInsertPositions.Before }));
            secondSortable.find('li').trigger('dragenter', getEventDummy());

            ((MSortableDefaultInsertionMarkerBehavior as any) as jest.Mock).mockImplementation(() => ({ getInsertPosition: () => MSortInsertPositions.After }));
            secondSortable.find('li').trigger('dragenter', getEventDummy());

            expect(secondSortable.find('li').element.classList).toContain(MSortableClassNames.SortAfter);
            expect(secondSortable.find('li').element.classList).not.toContain(MSortableClassNames.SortBefore);
        });
    });

    describe('onDragLeave', () => {
        let sortable: Wrapper<Vue>;
        let secondSortable: Wrapper<Vue>;
        let plugin: MSortable;
        let secondPlugin: MSortable;

        beforeEach(() => {
            sortable = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
            plugin = MDOMPlugin.get(MSortable, sortable.element);
            makeDroppable(plugin);

            secondSortable = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
            secondPlugin = MDOMPlugin.get(MSortable, secondSortable.element);
            makeDroppable(secondPlugin);
        });

        it('should cleanup when leaving sortable', () => {
            jest.spyOn(plugin, 'doCleanUp');

            sortable.find('li').trigger('dragenter', getEventDummy());
            sortable.find('li').trigger('dragleave', getEventDummy());

            expect(plugin.doCleanUp).toHaveBeenCalled();
            expect(MSortable.activeSortContainer).toBeUndefined();
        });

        it('should cleanup when leaving sortable for another sortable', () => {
            jest.spyOn(plugin, 'doCleanUp');

            sortable.find('li').trigger('dragenter', getEventDummy());
            secondSortable.find('li').trigger('dragenter', getEventDummy());
            sortable.find('li').trigger('dragleave', getEventDummy());

            expect(plugin.doCleanUp).toHaveBeenCalled();
            expect(MSortable.activeSortContainer).toBe(secondPlugin);
        });
    });

    describe('onDrop', () => {
        const buildSortable: (options: MSortableOptions) => Wrapper<Vue> = (options: MSortableOptions) => {
            const sortable: Wrapper<Vue> = getSortableDirective(true, options);
            makeDroppable(MDOMPlugin.get(MSortable, sortable.element));
            return sortable;
        };

        it('it should handle drop correctly when adding a new item to a sortable', () => {
            const dragData: any = { id: 0 };
            const sortable: Wrapper<Vue> = buildSortable({ acceptedActions: ['any'], items: [{ id: 0 }] });
            const userDefinedAction: string = 'someAction';
            const userDefinedGrouping: string = 'someGrouping';
            const draggable: Wrapper<Vue> = getDraggableDirective(true, { action: userDefinedAction, dragData, grouping: userDefinedGrouping });

            draggable.trigger('dragstart', getEventDummy());
            sortable.find('li').trigger('dragover', getEventDummy());
            sortable.find('li').trigger('drop', getEventDummy());

            const event: any = sortable.emitted(MSortableEventNames.OnAdd)[0][0];
            expect(event.sortInfo).toEqual({ canDrop: true, data: dragData, action: userDefinedAction, oldPosition: -1, newPosition: 1, grouping: userDefinedGrouping });
            expect(sortable.emitted(MSortableEventNames.OnMove)).toBeUndefined();
            expect(sortable.emitted(MSortableEventNames.OnRemove)).toBeUndefined();
        });

        it('it should handle drop correctly when moving an item to another index in the same sortable', () => {
            const dragData: any = { id: 0 };
            const sortable: Wrapper<Vue> = buildSortable({ acceptedActions: ['any'], items: [dragData, { id: 1 }] });
            const childWrappers: WrapperArray<Vue> = sortable.findAll('li');

            childWrappers.at(0).trigger('dragstart', getEventDummy());
            childWrappers.at(1).trigger('dragover', getEventDummy());
            childWrappers.at(1).trigger('drop', getEventDummy());

            const event: any = sortable.emitted(MSortableEventNames.OnMove)[0][0];
            expect(event.sortInfo).toEqual({ canDrop: true, data: dragData, action: 'move', oldPosition: 0, newPosition: 1 });
            expect(sortable.emitted(MSortableEventNames.OnAdd)).toBeUndefined();
            expect(sortable.emitted(MSortableEventNames.OnRemove)).toBeUndefined();
        });

        it('it should handle drop correctly when moving an item from one sortable to another', () => {
            const dragData: any = { id: 0 };
            const sortable: Wrapper<Vue> = buildSortable({ acceptedActions: ['any'], items: [dragData] });
            const secondSortable: Wrapper<Vue> = buildSortable({ acceptedActions: ['any'], items: [{ id: 1 }] });

            sortable.find('li').trigger('dragstart', getEventDummy());
            secondSortable.find('li').trigger('dragover', getEventDummy());
            secondSortable.find('li').trigger('drop', getEventDummy());

            const event: any = secondSortable.emitted(MSortableEventNames.OnMove)[0][0];
            expect(event.sortInfo).toEqual({ canDrop: true, data: dragData, action: 'move', oldPosition: -1, newPosition: 1 });
            expect(secondSortable.emitted(MSortableEventNames.OnAdd)).toBeUndefined();

            const removeEvent: any = sortable.emitted(MSortableEventNames.OnRemove)[0][0];
            expect(removeEvent.sortInfo).toEqual({ canDrop: true, data: dragData, action: 'move', oldPosition: 0, newPosition: -1 });
        });
    });

    describe('onChildDragStart', () => {
        let sortable: Wrapper<Vue>;
        let plugin: MSortable;
        beforeEach(() => {
            sortable = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
            plugin = MDOMPlugin.get(MSortable, sortable.element);
        });

        it('it should manage dragEvent correctly', () => {
            const dropEventDummy: any = getEventDummy();
            jest.spyOn(dropEventDummy, 'stopPropagation');

            sortable.find('li').trigger('dragstart', dropEventDummy);

            expect(dropEventDummy.stopPropagation).toHaveBeenCalled();
            expect(MSortable.fromSortContainer).toBeDefined();
            expect(MSortable.fromSortContainer).toBe(plugin);
        });
    });

    describe('onChildDragEnd', () => {
        let sortable: Wrapper<Vue>;
        let plugin: MSortable;
        beforeEach(() => {
            sortable = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
            plugin = MDOMPlugin.get(MSortable, sortable.element);
            sortable.find('li').trigger('dragstart', getEventDummy());
        });

        it('it should manage dragEvent correctly', () => {
            const dropEventDummy: any = getEventDummy();
            jest.spyOn(dropEventDummy, 'stopPropagation');
            jest.spyOn(plugin, 'doCleanUp');

            sortable.find('li').trigger('dragend', dropEventDummy);

            expect(dropEventDummy.stopPropagation).toHaveBeenCalled();
            expect(MSortable.fromSortContainer).toBeUndefined();
            expect(plugin.doCleanUp).toHaveBeenCalled();
        });

        it('it should manage dragEvent correctly when there is an active sort container', () => {
            const secondSortable: Wrapper<Vue> = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });

            secondSortable.find('li').trigger('dragover', getEventDummy());
            const secondSortablePlugin: MSortable = MDOMPlugin.get(MSortable, secondSortable.element);
            jest.spyOn(secondSortablePlugin, 'doCleanUp');
            sortable.find('li').trigger('dragend', getEventDummy());

            expect(secondSortablePlugin.doCleanUp).toHaveBeenCalled();
            expect(MSortable.activeSortContainer).toBeUndefined();
        });
    });

    describe('doCleanUp', () => {
        let sortable: Wrapper<Vue>;
        let plugin: MSortable;

        const addClass: (element: HTMLElement, className: string) => void = (element: HTMLElement, className: string) => {
            if (!element.classList.contains(className)) {
                element.classList.add(className);
            }
        };

        beforeEach(() => {
            sortable = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
            plugin = MDOMPlugin.get(MSortable, sortable.element);
        });

        it('it should never clean up Sortable class', () => {
            addClass(sortable.element, MSortableClassNames.Sortable);

            plugin.doCleanUp();

            expect(sortable.element.classList).toContain(MSortableClassNames.Sortable);
        });

        [MSortableClassNames.SortAfter, MSortableClassNames.SortBefore, MSortableClassNames.SortIn].forEach(className => {
            it(`it should clean up ${className} class when it exists on element`, () => {
                addClass(sortable.element as HTMLElement, className);

                plugin.doCleanUp();

                expect(sortable.element.classList).not.toContain(className);
            });

            it(`it should clean up ${className} class when it exists on element child`, () => {
                addClass(sortable.element.children[0] as HTMLElement, className);

                plugin.doCleanUp();

                expect(sortable.element.querySelector(`.${className}`)).toBeNull();
            });
        });
    });
});
