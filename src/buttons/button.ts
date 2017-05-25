import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './button.html?style=./button.scss';

@WithRender
@Component
export class ButtonComponent extends Vue {
    public highlight(): void {
        this.$el.style.backgroundColor = 'yellow';
    }
}
