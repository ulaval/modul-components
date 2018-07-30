import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export class FileMixin extends Vue {

    public extractFileExtension(filename: string): string {
        const match: RegExpMatchArray | null = filename.match(/\.([a-zA-Z0-9]{3,4})$/);
        return match ? match[1].toLowerCase() : '';
    }

}
