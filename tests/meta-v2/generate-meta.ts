// tslint:disable:no-console

import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { Meta } from '../../src/meta/v2/meta-v2';
import { MetaGenerator } from './meta-generator';

export interface ModulMeta {
    modulVersion?: string;
    components?: {
        category?: string,
        type?: string,
        beta?: false,
        components?: string[]
    }[];
    meta?: Meta;
}

let root: string = path.resolve(__dirname, '..', '..');
let destination: string = path.resolve(root, process.argv[2], 'modul-meta.json');
let packageFilePath: string = path.resolve(root, 'package.json');

function generateMeta(): void {

    let modulMeta: ModulMeta = {};

    console.log(`Generating metadata v2...`);
    const generator: MetaGenerator = new MetaGenerator();
    modulMeta.meta = generator.generateMeta();

    console.log(`Scanning file component.meta.json...`);
    let files: string[] = glob.sync('./src/**/*.meta.json');
    modulMeta.components = [];
    files.forEach((fileName) => {
        console.log(`filename =  ${fileName}`);

        const componentMeta: any = JSON.parse(fs.readFileSync(fileName, 'utf8'));

        modulMeta.components!.push({
            category: componentMeta.category,
            type: componentMeta.type,
            beta: componentMeta.beta,
            components: componentMeta.components
        });
    });

    // get version from package.json
    const packageFileContent: any = JSON.parse(fs.readFileSync(packageFilePath, 'utf8'));
    modulMeta.modulVersion = packageFileContent.version;

    // write metadata file
    fs.writeFile(destination, JSON.stringify(modulMeta), 'utf8', (err) => {
        if (err) {
            console.error(`Error occured while generating metadata v2 [${JSON.stringify(err)}]`);
        } else {
            console.log(`Success - Generated metadata v2 in ${destination}`);
        }
    });

}


generateMeta();
// tslint:enable:no-console
