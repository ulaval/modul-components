import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './text-icon.html?style=./text-icon.scss';
import { TEXT_ICON_NAME } from '../component-names';

@WithRender
@Component
export class MTextIcon extends Vue {
    private componentName: string = TEXT_ICON_NAME;

    public get hasIconeLeft(): boolean {
        return !!this.$slots['icon-left'];
    }

    public get hasIconeRight(): boolean {
        return !!this.$slots['icon-right'];
    }
}
