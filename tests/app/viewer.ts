import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import WithRender from './viewer.html';

@WithRender
@Component
export class Viewer extends Vue {
    public tag: string = '';

    public elements = [{codeSession: '201701', dateDebutSession: '2017-09-04T00:00:00-0400', dateFinSession: '2018-01-07T00:00:00-0500', annee: '2017', saison: 'HIVER'},
                       {codeSession: '201709', dateDebutSession: '2017-09-04T00:00:00-0400', dateFinSession: '2018-01-07T00:00:00-0500', annee: '2017', saison: 'AUTOMNE'},
                       {codeSession: '201705', dateDebutSession: '2017-09-04T00:00:00-0400', dateFinSession: '2018-01-07T00:00:00-0500', annee: '2017', saison: 'ETE'}];
    // public elements = ['201701', '201709', '201705', 'ETE'];
    public open: boolean = false;
    public ext: string[] = [];

    public mounted() {
        this.buildTag();
    }

    public getText(element: any): string {
        return element.saison + ' - ' + element.annee;
    }

    public alertMe($event): void {
        console.log($event);
    }

    public change() {
        this.ext.push('.abc');
    }

    @Watch('$route')
    private buildTag(): void {
        this.tag = `<${this.$route.meta}></${this.$route.meta}>`;
    }
}
