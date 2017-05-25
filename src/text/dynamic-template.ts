import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import WithRender from './dynamic-template.html';

@WithRender
@Component
export class DynamicTemplateComponent extends Vue {
    @Prop()
    public template: string;

    public internalTemplate: string = '';

    @Watch('template')
    public onTemplate() {
        Vue.component('int-template', {
            template: '<div>' + this.template + '</div>'
        });
        this.internalTemplate = '';
        this.internalTemplate = 'int-template';
    }
}
