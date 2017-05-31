import Vue from 'vue';
import Component from 'vue-class-component';
import WithRender from './status-list.html?style=./status-list.scss';

@WithRender
@Component
export class MStatusList extends Vue {
    public highlight(): void {
        console.log('status list init');
    }
}
