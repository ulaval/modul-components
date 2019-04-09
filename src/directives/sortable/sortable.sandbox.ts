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

    elementsWithHandle1: Array<ElementSortable> = [this.element1, this.element2, this.element3, this.element4, this.element5];
    elementsWithHandle2: Array<ElementSortable> = [this.element1, this.element2, this.element3, this.element4, this.element5, this.element6];
    elementsWithoutHandle: Array<ElementSortable> = [this.element1, this.element2, this.element3, this.element4, this.element5, this.element6];

    get elementsSortableWithHandle1(): ElementSortable[] {
        return this.elementsWithHandle1;
    }

    get elementsSortableWithHandle2(): ElementSortable[] {
        return this.elementsWithHandle2;
    }

    get elementsSortableWithoutHandle(): ElementSortable[] {
        return this.elementsWithoutHandle;
    }

    isDraggable(cle: number): string {
        return cle === 6 ? 'false' : 'true';
    }

    deplacerElementsWithHandle1(event: MSortEvent): void {
        this.arraymove(this.elementsWithHandle1, event.sortInfo.oldPosition, event.sortInfo.newPosition);
    }

    deplacerElementsWithHandle2(event: MSortEvent): void {
        this.arraymove(this.elementsWithHandle2, event.sortInfo.oldPosition, event.sortInfo.newPosition);
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
