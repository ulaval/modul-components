import { mousePositionElement, RelativeMousePos } from '../../utils/mouse/mouse';
import { MDropEvent, MDroppable } from '../drag-and-drop/droppable/droppable';
import { MSortInsertPositions } from './sortable';

export interface MSortableInsertionMarkerBehavior {
    getInsertPosition(event: MDropEvent): MSortInsertPositions;
}

export class MSortableDefaultInsertionMarkerBehavior implements MSortableInsertionMarkerBehavior {
    getInsertPosition(event: MDropEvent): MSortInsertPositions {
        if (MDroppable.currentHoverDroppable) {
            const mousePosition: RelativeMousePos = mousePositionElement(event, MDroppable.currentHoverDroppable.element);
            if (mousePosition.y < MDroppable.currentHoverDroppable.element.offsetHeight / 2) {
                return MSortInsertPositions.Before;
            } else {
                return MSortInsertPositions.After;
            }
        }

        return MSortInsertPositions.After;
    }
}

export class MSortableGroupingInsertionMarkerBehavior implements MSortableInsertionMarkerBehavior {
    getInsertPosition(event: MDropEvent): MSortInsertPositions {
        if (!MDroppable.currentHoverDroppable) { return MSortInsertPositions.After; }

        const mousePosition: RelativeMousePos = mousePositionElement(event, MDroppable.currentHoverDroppable.element);
        if (mousePosition.y <= 10) { return MSortInsertPositions.Before; }
        if (mousePosition.y > MDroppable.currentHoverDroppable.element.offsetHeight - 10) { return MSortInsertPositions.After; }

        return MSortInsertPositions.In;
    }
}
