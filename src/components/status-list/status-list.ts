import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './status-list.html?style=./status-list.scss';
import { STATUS_LIST_NAME } from '../component-names';
@WithRender
@Component

export class MStatusList extends Vue {
    private componentName = STATUS_LIST_NAME;

    @Prop({
        default:
        function() {
            return [
                {
                    'status': 'completed',
                    'text': 'Informations default'
                },
                {
                    'status': 'pending',
                    'text': 'Questions default'
                },
                {
                    'status': 'error',
                    'text': 'Pièces default'
                },
                {
                    'status': 'completed',
                    'text': 'Formulaire default'
                }
            ];
        }
    })
    private model: Object[];

    public values: Object[] = this.model;

    public getIcon(status): string {
        let icon: string = '';
        switch (status) {
        case 'completed':
            icon = 'pastille-crochet';
            break;
        case 'pending':
            icon = 'pastille-crochet-jaune';
            break;
        case 'error':
            icon = 'pastille-erreur';
            break;
        default:
            break;
        }
        return icon;
    }

}
