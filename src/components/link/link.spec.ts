import Vue from 'vue';
import '../../utils/polyfills';
import LinkPlugin, { MLink, MLinkMode, MLinkIconPosition } from './link';

const UNVISITED_CSS: string = 'm--is-unvisited';
const NO_UNDERLINE_CSS: string = 'm--no-underline';
const MODE_BUTTON_CSS: string = 'm--is-button';
const VANILLA_CSS: string = 'm--is-vanilla';
const ICON_POSITION_RIGHT_CSS: string = 'm--has-right-icon';

let link: MLink;

describe('MLinkMode', () => {
    it('validates enum', () => {
        expect(MLinkMode.Link).toEqual('link');
        expect(MLinkMode.Button).toEqual('button');
        expect(MLinkMode.ExternalLink).toEqual('external-link');
        expect(MLinkMode.RouterLink).toEqual('router-link');
    });
});

describe('MLinkIconPosition', () => {
    it('validates enum', () => {
        expect(MLinkIconPosition.Left).toEqual('left');
        expect(MLinkIconPosition.Right).toEqual('right');
    });
});

describe('link', () => {

    // Todo: Rooter-link problem on mount

    // beforeEach(() => {
    //     Vue.use(LinkPlugin);
    //     link = new MLink().$mount();
    // });

    // it('css class for link are present', () => {
    //     console.log(link.$el);
    // });

});
