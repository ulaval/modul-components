// import 'croppie/croppie.css';
import Vue, { PluginObject } from 'vue';
import Component from 'vue-class-component';
import VueCroppie from 'vue-croppie';
import { Prop } from 'vue-property-decorator';
import { PHOTO_EDITOR_NAME } from '../component-names';
import WithRender from './photo-editor.html?style=./photo-editor.scss';

@WithRender
@Component
export class MPhotoEditor extends Vue {
    @Prop({ required: true })
    url!: string;

    @Prop({ default: 400 })
    width!: number;

    @Prop({ default: 400 })
    height!: number;

    $refs!: {
        croppieRef: VueCroppie,
        canvas: HTMLCanvasElement,
        image: HTMLImageElement
    };

    zoom: number = 1;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    mounted(): void {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext('2d')!;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.drawImage();
    }

    updateZoom(newZoom: number): void {
        this.zoom = newZoom;
        this.drawImage();
    }

    drawImage(): void {
        // replace 0, 0 by offset when drag is implemented
        this.ctx.drawImage(this.$refs.image, 0, 0, this.$refs.image.naturalWidth * this.zoom, this.$refs.image.naturalHeight * this.zoom);
    }

    // mounted(): void {
    //     this.updateUrl();
    // }

    // @Watch('url')
    // updateUrl(): void {
    //     this.$refs.croppieRef.bind({
    //         url: this.url
    //     });
    // }
}

const PhotoEditorPlugin: PluginObject<any> = {
    install(v): void {
        v.prototype.$log.debug(PHOTO_EDITOR_NAME, 'plugin.install');
        // v.use(VueCroppie);
        v.component(PHOTO_EDITOR_NAME, MPhotoEditor);
    }
};

export default PhotoEditorPlugin;
