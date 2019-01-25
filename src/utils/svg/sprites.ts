import { PluginObject } from 'vue';
import uuid from '../uuid/uuid';

declare module 'vue/types/vue' {
    interface Vue {
        $svg: SpritesService;
    }
}

export class SpritesService {
    public addSprites(sprites: string): string {
        let div: HTMLDivElement = document.createElement('div');
        let id: string = uuid.generate();
        div.id = id;
        div.setAttribute('aria-hidden', 'true');
        div.style.display = 'none';
        div.innerHTML = sprites;
        document.body.insertBefore(div, document.body.childNodes[0]);

        return id;
    }
}

const SpritesPlugin: PluginObject<any> = {
    install(v, options): void {
        v.prototype.$log.debug('$svg', 'plugin.install');
        let svg: SpritesService = new SpritesService();
        (v.prototype).$svg = svg;
    }
};

export default SpritesPlugin;
