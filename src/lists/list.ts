import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './list.html?style=./list.scss';

@WithRender
@Component
export class ListComponent extends Vue {
    public get values(): string[] {
        return ['v1', 'v3', 'v3'];
    }
}

export const LIST_NAME: string = 'mpo-list';
