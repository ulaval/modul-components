// tslint:disable
export const createMockFileList = (files: File[]): FileList => {

    let fl = {
        length: files.length,
        item: i => {
            return files[i];
        }
    };
    for (let i = 0; i < files.length; ++i) {
        fl[i] = files[i];
    }
    return fl;
};

export const createMockFile = (name: string, size?: number): File => {
    const file: any = new Blob([new ArrayBuffer(size ? size : 1)]);
    file['name'] = name;
    return file as File;
};
// tslint:enable
