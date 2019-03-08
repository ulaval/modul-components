import { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import { ModulVue } from '../../utils/vue/vue';
import { SORTABLE_NAME } from '../directive-names';
import SortablePlugin, { MSortEvent } from './sortable';
import WithRender from './sortable.sandbox.html?style=./sortable.scss';

export type ElementSortable = { cle: string, titre: string };

@WithRender
@Component
export class MSortableSandbox extends ModulVue {
    element1: ElementSortable = { cle: '1', titre: 'Element 1' };
    element2: ElementSortable = { cle: '2', titre: 'Element 2' };
    element3: ElementSortable = { cle: '3', titre: 'Element 3' };
    element4: ElementSortable = { cle: '4', titre: 'Element 4' };
    element5: ElementSortable = { cle: '5', titre: 'Element 5' };

    elementsWithHandle: Array<ElementSortable> = [this.element1, this.element2, this.element3, this.element4, this.element5];
    elementsWithoutHandle: Array<ElementSortable> = [this.element1, this.element2, this.element3, this.element4, this.element5];

    get elementsSortableWithHandle(): ElementSortable[] {
        return this.elementsWithHandle;
    }

    get elementsSortableWithoutHandle(): ElementSortable[] {
        return this.elementsWithoutHandle;
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
}

const SortableSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(SortablePlugin);
        v.component(`${SORTABLE_NAME}-sandbox`, MSortableSandbox);
    }
};

export default SortableSandboxPlugin;
