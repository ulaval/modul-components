import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { SORTABLE_NAME } from '../directive-names';
import SortablePlugin, { MSortEvent } from './sortable';
import WithRender from './sortable.sandbox.html?style=./sortable.scss';

export type ElementSortable = { cle: number, titre: string };

@WithRender
@Component
export class MSortableSandbox extends ModulVue {

    peutEtreDrag: boolean = false;

    element1: ElementSortable = { cle: 1, titre: 'Element 1' };
    element2: ElementSortable = { cle: 2, titre: 'Element 2' };
    element3: ElementSortable = { cle: 3, titre: 'Element 3' };
    element4: ElementSortable = { cle: 4, titre: 'Element 4' };
    element5: ElementSortable = { cle: 5, titre: 'Element 5' };
    element6: ElementSortable = { cle: 6, titre: 'Element 6 - draggable false' };

    elementsWithHandleNoAttribut: Array<ElementSortable> = [this.element1, this.element2, this.element3, this.element4, this.element5];
    elementsWithHandleWithAttribut: Array<ElementSortable> = [this.element1, this.element2, this.element3, this.element4, this.element5, this.element6];
    elementsWithHandle: Array<ElementSortable> = [this.element1, this.element2, this.element3, this.element4, this.element5, this.element6];
    elementsWithoutHandle: Array<ElementSortable> = [this.element1, this.element2, this.element3, this.element4, this.element5, this.element6];

    get elementsSortableWithHandleNoAttribut(): ElementSortable[] {
        return this.elementsWithHandleNoAttribut;
    }

    get elementsSortableWithHandleWithAttribut(): ElementSortable[] {
        return this.elementsWithHandleWithAttribut;
    }

    get elementsSortableWithHandle(): ElementSortable[] {
        return this.elementsWithHandle;
    }

    get elementsSortableWithoutHandle(): ElementSortable[] {
        return this.elementsWithoutHandle;
    }

    isDraggable(cle: number): string {
        return cle === 6 ? 'false' : 'true';
    }

    deplacerElementsWithHandleNoAttribut(event: MSortEvent): void {
        this.arraymove(this.elementsWithHandleNoAttribut, event.sortInfo.oldPosition, event.sortInfo.newPosition);
    }

    deplacerElementsWithHandleWithAttribut(event: MSortEvent): void {
        this.arraymove(this.elementsWithHandleWithAttribut, event.sortInfo.oldPosition, event.sortInfo.newPosition);
    }

    deplacerElementsWithHandle(event: MSortEvent): void {
        this.arraymove(this.elementsWithHandle, event.sortInfo.oldPosition, event.sortInfo.newPosition);
    }

    deplacerElementsWithoutHandle(event: MSortEvent): void {
        this.arraymove(this.elementsWithoutHandle, event.sortInfo.oldPosition, event.sortInfo.newPosition);
    }

    arraymove(arr, oldIndex, newIndex): void {
        let elements: Array<ElementSortable> = arr[oldIndex];
        arr.splice(oldIndex, 1);
        arr.splice(newIndex, 0, elements);
    }

    basculePeutEtreDrag(valeur: boolean): void {
        this.peutEtreDrag = valeur;
    }
}

const SortableSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(SortablePlugin);
        v.component(`${SORTABLE_NAME}-sandbox`, MSortableSandbox);
    }
};

export default SortableSandboxPlugin;
