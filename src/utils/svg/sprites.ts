import { PluginObject } from 'vue';

import uuid from '../uuid/uuid';

export class SpritesService {
    public addSprites(sprites: string): void {
        let div: HTMLDivElement = document.createElement('div');
        let id: string = uuid.generate();
        div.id = id;
        div.setAttribute('aria-hidden', 'true');
        div.style.display = 'none';
        div.innerHTML = sprites;
        document.body.insertBefore(div, document.body.childNodes[0]);
    }
}

const SpritesPlugin: PluginObject<any> = {
    install(v, options) {
        console.debug('$svg', 'plugin.install');
        let svg = new SpritesService();
        (v.prototype as any).$svg = svg;
    }
};

export default SpritesPlugin;
