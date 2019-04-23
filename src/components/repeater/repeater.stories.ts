import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/vue';
import { componentsHierarchyRootSeparator } from '../../../conf/storybook/utils';
import uuid from '../../utils/uuid/uuid';
import { REPEATER_NAME } from '../component-names';
import { MRepeater } from './repeater';

storiesOf(`${componentsHierarchyRootSeparator}${REPEATER_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('Empty', () => ({
        components: { MRepeater },
        template: `
            <${REPEATER_NAME}
                :empty-message="'The list is empty'"
                :list="list"
                :operations="operations">
                <template slot="item" slot-scope="{}">
                </template>
            </${REPEATER_NAME}>
        `,
        data: () => ({
            list: [],
            operations: {
                canAdd: false,
                cadDelete: false
            }
        }),
        methods: {
            onAdd(): void {
                (this as any).list.push({ id: uuid.generate() });
            },
            onDelete(index): void {
                (this as any).list.splice(index, 1);
            }
        }
    }));

storiesOf(`${componentsHierarchyRootSeparator}${REPEATER_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('With items (Custom item template)', () => ({
        components: { MRepeater },
        template: `
            <${REPEATER_NAME}
                :item-key="'id'"
                :list="list"
                @add="onAdd"
                @delete="onDelete">
                <template slot="item" slot-scope="{ item, index }">
                    Item # {{ index }} {{ item.id }}
                </template>
            </${REPEATER_NAME}>
        `,
        data: () => ({
            list: [{ id: uuid.generate() }, { id: uuid.generate() }]
        }),
        methods: {
            onAdd(): void {
                (this as any).list.push({ id: uuid.generate() });
            },
            onDelete(index): void {
                (this as any).list.splice(index, 1);
            }
        }
    }));

storiesOf(`${componentsHierarchyRootSeparator}${REPEATER_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('With items (Custom row template)', () => ({
        components: { MRepeater },
        template: `
            <${REPEATER_NAME}
                :list="list"
                @add="onAdd"
                @delete="onDelete">
                <li slot="row" slot-scope="{ item, index, deleteFn }" :key="item.id">
                    <button @click="deleteFn()">Delete</button>
                    Item # {{ index }} {{ item.id }}
                </li>
            </${REPEATER_NAME}>
        `,
        data: () => ({
            list: [{ id: uuid.generate() }, { id: uuid.generate() }]
        }),
        methods: {
            onAdd(): void {
                (this as any).list.push({ id: uuid.generate() });
            },
            onDelete(index): void {
                (this as any).list.splice(index, 1);
            }
        }
    }));

storiesOf(`${componentsHierarchyRootSeparator}${REPEATER_NAME}`, module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .add('Operations', () => ({
        components: { MRepeater },
        template: `
            <${REPEATER_NAME}
                :item-key="'id'"
                :list="list"
                :operations="operations">
                <template slot="item" slot-scope="{ item, index }">
                    #{{ index }} Custom template for item (id: {{ item.id }} name: {{ item.name }})
                </template>
            </${REPEATER_NAME}>
        `,
        data: () => ({
            list: [{ id: 324525, name: 'Albert Einstein' }, { id: 64564556, name: 'Nikola Tesla' }],
            operations: {
                canAdd: false,
                cadDelete: false
            }
        })
    }));
