import filesize from 'filesize';
import Vue, { PluginObject } from 'vue';

import { Messages } from '../../utils/i18n/i18n';
import { FILESIZE_NAME } from '../filter-names';

let filesizeSymbols: { [name: string]: string } | undefined = undefined;

export const fileSize: (bytes: number) => string = (bytes) => {
    if (!filesizeSymbols) {
        const i18n: Messages = (Vue.prototype).$i18n;
        filesizeSymbols = {
            B: i18n.translate('f-m-filesize:size-b'),
            KB: i18n.translate('f-m-filesize:size-kb'),
            MB: i18n.translate('f-m-filesize:size-mb'),
            GB: i18n.translate('f-m-filesize:size-gb')
        };
    }

    return filesize(bytes, {
        symbols: filesizeSymbols
    });
};

const FileSizeFilterPlugin: PluginObject<any> = {
    install(v, options): void {
        v.filter(FILESIZE_NAME, fileSize);
    }
};

export default FileSizeFilterPlugin;
