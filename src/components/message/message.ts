
LOCAL
2/2
dev
3
master
REMOTE
3/3
origin
Demo-+-components-project-structure
dev
master
STASHES
1
On dev: Auto stash before rebase of "origin/dev"
TAGS
0/0
SUBMODULES
0
src/components/message/message.ts
Ignore white space
@@ -0,0 +1,49 @@
import Vue from 'vue';
import { PluginObject } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import WithRender from './message.html?style=./message.scss';
import { MESSAGE_NAME } from '../component-names';

@WithRender
@Component
export class MMessage extends Vue {
    @Prop({ default: 'success' })
    public type: string;
    @Prop({ default: 'regular' })
    public mode: string;
    @Prop({ default: true })
    public hasIcon: boolean;

    private componentName = MESSAGE_NAME;

    public getIcon(): string {
        let icon: string = '';
        switch (this.$props.type) {
            case 'success':
                icon = 'pastille-crochet';
                break;
            case 'info':
                icon = 'pastille-attention-rouge';
                break;
            case 'warning':
                icon = 'pastille-attention';
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

const MessagePlugin: PluginObject<any> = {
    install(v, options) {
        v.component(MESSAGE_NAME, MMessage);
    }
};

export default MessagePlugin;
