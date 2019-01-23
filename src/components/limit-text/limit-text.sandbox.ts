import Vue, { PluginObject } from 'vue';
import { Component } from 'vue-property-decorator';
import ButtonPlugin from '../button/button';
import { LIMIT_TEXT_NAME } from '../component-names';
import LimitTextPlugin from './limit-text';
import WithRender from './limit-text.sandbox.html';


@WithRender
@Component
export class MLimitTextSandbox extends Vue {
    private text1: string = 'Non cillum et mollit excepteur reprehenderit occaecat adipisicing culpa dolore culpa ipsum esse irure id. Cupidatat ut consectetur reprehenderit consectetur occaecat elit tempor sint cupidatat deserunt minim pariatur. Quis irure sunt labore nulla fugiat consequat nulla et aliqua. Excepteur ullamco labore commodo ipsum nisi veniam cillum dolor nulla qui aliqua tempor tempor proident. Sit incididunt sint velit nostrud nisi fugiat consequat nisi amet anim voluptate. Ea qui dolore laborum dolore amet.Irure magna elit et eiusmod consectetur elit incididunt non sit ea. In occaecat adipisicing occaecat laborum labore et sunt velit. Duis laborum aliqua excepteur in ex in. Laboris velit esse incididunt qui mollit velit. Veniam veniam ullamco proident labore. Velit culpa aliqua culpa deserunt et do aute id qui ullamco pariatur consequat velit nostrud.Nostrud quis excepteur est incididunt laborum proident enim. Eu labore eiusmod do incididunt dolore proident deserunt ullamco velit sit do eiusmod. Veniam nisi laborum officia incididunt fugiat. Ut et occaecat sint aliqua enim pariatur et. Exercitation reprehenderit esse aute reprehenderit esse aliquip sint do mollit nulla do reprehenderit est. Minim aliquip nulla velit commodo sint id. Dolore dolore pariatur officia ea adipisicing id quis amet ullamco.Adipisicing sit labore voluptate sit sunt quis. Quis est voluptate aliquip voluptate. Nisi aliquip exercitation ullamco tempor cupidatat. Do eiusmod dolore consectetur pariatur est mollit sit qui id qui culpa adipisicing.Ut ut nisi cupidatat do voluptate nisi mollit amet. Enim laborum minim velit minim sit culpa magna incididunt aute occaecat sit. Laborum officia est proident excepteur. Aute occaecat nisi ad qui mollit nostrud occaecat laborum sit deserunt. Elit aliqua qui deserunt incididunt nisi cillum. Id nulla consequat exercitation ipsum anim mollit nostrud.';
    private text2: string = 'Excepteur amet veniam commodo voluptate minim ut. Labore minim pariatur quis irure proident adipisicing reprehenderit. Sunt cillum Lorem aute amet consequat. Pariatur cillum tempor et ipsum deserunt.Dolor minim adipisicing consectetur occaecat dolore non sit anim aliqua aliqua exercitation. Adipisicing excepteur quis fugiat cupidatat elit ea laboris excepteur consequat enim quis consectetur minim veniam. Dolore culpa anim culpa amet commodo est. Labore voluptate do esse laboris et consectetur velit proident ad.Deserunt qui qui id deserunt culpa et exercitation ad aliquip irure aute veniam ut culpa. Sunt excepteur tempor occaecat ullamco in eu proident pariatur. Officia mollit ullamco sunt ea sit qui eu. Tempor enim tempor eu nisi aliqua consequat nostrud. Irure deserunt mollit nostrud ut eu esse. Nostrud nulla deserunt labore nisi ipsum culpa ipsum do magna ut excepteur aute nulla.Laboris sint aute dolore anim ut dolor cillum incididunt. Quis officia proident officia Lorem proident ullamco ex minim id dolor officia proident et esse. Ullamco labore ex exercitation commodo deserunt incididunt irure amet fugiat est anim qui sit sit.';
    private texte = this.text1;
    private testOpen: boolean = false;

    private vhtml: string = `<p><br /></p><p><p>Test rawhtml Deserunt ad amet sint in esse aute. Ut est cupidatat mollit ipsum aliqua nostrud. Proident aliqua anim tempor ut
            excepteur tempor ipsum qui</p><p> eu. Anim culpa voluptate occaecat veniam amet reprehenderit irure.Culpa laborum ullamco
            sint quis exercitation amet ad est sunt commodo. Eiusmod sint minim eu id consequat esse veniam. Ullamco labore
            do sit sit commodo. Deserunt ad amet sint in esse aute. Ut est cupidatat mollit ipsum aliqua nostrud. Proident
            aliqua anim tempor ut excepteur tempor ipsum qui eu. Anim culpa voluptate occaecat veniam amet reprehenderit
            irure.Culpa laborum ullamco sint quis exercitation amet ad est sunt commodo. Eiusmod sint minim eu id consequat
            esse veniam. Ullamco labore do sit sit </p><p>commodo. Deserunt ad amet sint in esse aute. Ut est cupidatat mollit ipsum
            aliqua nostrud. Proident aliqua anim tempor ut excepteur tempor ipsum qui eu. Anim culpa voluptate occaecat veniam
            amet reprehenderit irure.Culpa laborum ullamco sint quis exercitation amet ad est sunt commodo. Eiusmod sint
            minim eu id consequat esse veniam. Ullamco labore do sit sit commodo. Deserunt ad amet sint in esse aute. Ut
            est cupidatat mollit ipsum aliqua nostrud. Proident aliqua anim tempor ut excepteur tempor ipsum qui eu. Anim
            culpa voluptate occaecat veniam amet reprehenderit irure.Culpa laborum ullamco sint quis exercitation amet ad
            est sunt commodo. Eiusmod sint minim eu id consequat esse veniam. Ullamco labore do sit sit commodo. Deserunt
            ad amet sint in esse aute. Ut est cupidatat mollit ipsum aliqua nostrud. Proident aliqua anim tempor ut excepteur
            tempor ipsum qui eu. Anim culpa voluptate occaecat veniam amet reprehenderit irure.Culpa laborum ullamco sint
            quis exercitation amet ad est sunt commodo. </p><p>Eiusmod sint minim eu id consequat esse veniam. Ullamco labore do
            sit sit commodo. Deserunt ad amet sint in esse aute. Ut est cupidatat mollit ipsum aliqua nostrud. Proident aliqua
            anim tempor ut excepteur tempor ipsum qui eu. Anim culpa voluptate occaecat veniam amet reprehenderit irure.Culpa
            laborum ullamco sint quis exercitation amet ad est sunt commodo. Eiusmod sint minim eu id consequat esse veniam.
            Ullamco labore do sit sit commodo. Deserunt ad amet sint in esse aute. Ut est cupidatat mollit ipsum aliqua nostrud.
            Proident aliqua anim tempor ut excepteur tempor ipsum qui eu. Anim culpa voluptate occaecat veniam amet reprehenderit
            irure.Culpa laborum ullamco sint quis exercitation amet ad est sunt commodo. Eiusmod sint minim eu id consequat
            esse veniam. Ullamco labore do sit sit commodo.</p>`;

    private changingText(): void {
        if (this.texte === this.text1) {
            this.texte = this.text2;
        } else {
            this.texte = this.text1;
        }
    }
}

const LimitTextSandboxPlugin: PluginObject<any> = {
    install(v, options): void {
        v.use(LimitTextPlugin);
        v.use(ButtonPlugin);
        v.component(`${LIMIT_TEXT_NAME}-sandbox`, MLimitTextSandbox);
    }
};

export default LimitTextSandboxPlugin;
