import { mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';

import { resetModulPlugins } from '../../../tests/helpers/component';
import { ModulVue } from '../../utils/vue/vue';
import { MDraggable } from '../draggable/draggable';
import { MDroppable } from '../droppable/droppable';
import DroppableGroupPlugin from '../droppable/droppable-group';
import { MDOMPlugin } from './../domPlugin';
import { MDraggableClassNames } from './../draggable/draggable';
import { MSortableDefaultInsertionMarkerBehavior } from './insertion-behavior';
import SortablePlugin, { MSortable, MSortableAction, MSortableClassNames, MSortableOptions, MSortInsertPositions } from './sortable';

jest.mock('./insertion-behavior');
describe('sortable', () => {
    const emptyPlaceholderTemplate = `<li v-for="item in items" v-if="items.length">Item #{{ $index }}</li>`;
    const getSortableDirective: (bindingValue?: boolean, options?: MSortableOptions, innerHtml?: string) => Wrapper<Vue> =
    (bindingValue?: boolean, options?: MSortableOptions, innerHtml?: string) => {
        const innerHTML = `${innerHtml || emptyPlaceholderTemplate}`;
        let template: string;
        if (options) {
            template = bindingValue === undefined ? `<ul v-m-sortable :items="items" :accepted-actions="acceptedActions">${innerHTML}</ul>`
                    : `<ul v-m-sortable="${bindingValue}" :items="items" :accepted-actions="acceptedActions">${innerHTML}</ul>`;
        } else {
            template = bindingValue === undefined ? `<ul v-m-sortable>${innerHTML}</ul>`
                : `<ul v-m-sortable="${bindingValue}">${innerHTML}</ul>`;
        }

        return mount({
            template,
            data: () => options || {}
        }, { localVue: Vue });
    };

    const getEventDummy: () => any = () => {
        return { preventDefault: () => {}, stopPropagation: () => {}, dataTransfer: { setData: () => {}, setDragImage: () => {}, getData: () => {} } };
    };

    const makeDroppable: (sortable: MSortable) => void = (sortable: MSortable) => {
        const droppablePart = MDOMPlugin.get(MDroppable, sortable.element);
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
        // TODO : test element nested in a group.

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

            const droppablePlugin = MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement);
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

            const droppablePlugin = MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement);
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

            const draggablePlugin = MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement);
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
            const innerHtml = `<li v-for="item in items" v-if="items.length" v-m-droppable-group="1">Item #{{ $index }}</li>`;
            const sortable: Wrapper<Vue> = getSortableDirective(param, { acceptedActions: userDefinedActions, items: items }, innerHtml);

            const droppablePlugin = MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement);
            expect(droppablePlugin).toBeDefined();
            expect(droppablePlugin.options).toEqual({
                canDrop: true,
                acceptedActions: [...userDefinedActions, MSortableAction.Move, MSortableAction.MoveGroup]
            });
        });

        it('it should setup grouped childs draggable part correctly', () => {
            const userDefinedActions: string[] = ['a', 'b'];
            const userDefinedGroup = 1;
            const items: any[] = [{ id: 0 }];
            const innerHtml = `<li v-for="item in items" v-if="items.length" v-m-droppable-group="${userDefinedGroup}">Item #{{ $index }}</li>`;
            const sortable: Wrapper<Vue> = getSortableDirective(param, { acceptedActions: userDefinedActions, items: items }, innerHtml);

            const draggablePlugin = MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement);
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
        const sortable = getSortableDirective(false, { acceptedActions: ['someAction'], items: [{ id: 0 }] });

        expect(MDOMPlugin.get(MDroppable, sortable.element)).toBeUndefined();
        expect(MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
        expect(MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
    });

    it('it should not attach empty placeholder when binding false is provided', () => {
        const sortable = getSortableDirective(false, undefined, `<div class="${MSortableClassNames.EmptyPlaceholder}">Some placeholder</div>`);

        expect(MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
        expect(MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
    });

    describe('unbind', () => {
        it('it should clean up element correctly', () => {
            const sortable = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
            const plugin: MSortable = MDOMPlugin.get(MSortable, sortable.element);
            jest.spyOn(plugin, 'doCleanUp');

            sortable.destroy();

            expect(sortable.element.classList).not.toContain(MSortableClassNames.Sortable);
            expect(plugin.doCleanUp).toHaveBeenCalled();
            expect(MDOMPlugin.get(MDroppable, sortable.element)).toBeUndefined();
        });

        it('it should clean up empty placeholder when it exists', () => {
            const sortable = getSortableDirective(true, undefined, `<div class="${MSortableClassNames.EmptyPlaceholder}">Some placeholder</div>`);

            sortable.destroy();

            expect(MDOMPlugin.get(MDraggable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
            expect(MDOMPlugin.get(MDroppable, sortable.element.children[0] as HTMLElement)).toBeUndefined();
        });

        it('it should clean up childs correctly', () => {
            const sortable = getSortableDirective(true, { acceptedActions: ['someAction'], items: [{ id: 0 }] });
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
            const eventDummy = getEventDummy();
            jest.spyOn(eventDummy, 'stopPropagation');
            sortable.find('li').trigger('dragenter', eventDummy);

            expect(MSortable.activeSortContainer).toBe(plugin);
            expect(eventDummy.stopPropagation).toHaveBeenCalled();
        });

        it('it should handle transition from one active sortable to another', () => {
            const test = sortable.find('li');
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

    });

    /* describe('onDrop', () => {

    }); */

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
