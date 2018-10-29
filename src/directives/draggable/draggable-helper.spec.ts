import { draggableHasHandle, isHandleUsedToDrag } from './draggable-helper';

describe(`draggableHasHandle - test`, () => {
    describe(`Given element with child element with handle class`, () => {
        it(`Should return true`, () => {
            let element: HTMLElement = document.createElement('div');
            let childElement: HTMLElement = document.createElement('div');
            childElement.setAttribute('class', 'dragHandle');
            element.appendChild(childElement);

            let hasHandle: boolean = draggableHasHandle(element);

            expect(hasHandle).toBeTruthy();
        });
    });

    describe(`Given element with child element with no handle class`, () => {
        it(`Should return false`, () => {
            let element: HTMLElement = document.createElement('div');
            let childElement: HTMLElement = document.createElement('div');
            element.appendChild(childElement);

            let hasHandle: boolean = draggableHasHandle(element);

            expect(hasHandle).toBeFalsy();
        });
    });
});

describe(`isHandleUsedToDrag - test`, () => {
    describe(`Given a MouseEvent with a target that is an element with the class dragHandle`, () => {
        it(`Should return true`, () => {
            let element: HTMLElement = document.createElement('div');
            element.setAttribute('class', 'dragHandle');
            let mouseEvent: MouseEvent = { target: element } as any as MouseEvent;

            let handleIsUsedToDrag: boolean = isHandleUsedToDrag(mouseEvent);

            expect(handleIsUsedToDrag).toBeTruthy();
        });
    });

    describe(`Given a MouseEvent with a target that is an element without the class dragHandle`, () => {
        it(`Should return false`, () => {
            let element: HTMLElement = document.createElement('div');
            let mouseEvent: MouseEvent = { target: element } as any as MouseEvent;

            let handleIsUsedToDrag: boolean = isHandleUsedToDrag(mouseEvent);

            expect(handleIsUsedToDrag).toBeFalsy();
        });
    });
});
