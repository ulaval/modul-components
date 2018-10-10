import * as fs from 'fs';
import * as path from 'path';

import { Meta } from '../../src/meta/v2';
import { MetaGenerator } from './meta-generator';

let root: string = path.resolve(__dirname,'..', '..') ;
let destination: string = path.resolve(root,process.argv[2], 'modul-meta.json') ;
let packageFilePath: string = path.resolve(root,'package.json') ;

// tslint:disable-next-line:no-console
console.log(`Generating metadata v2...`);

const generator: MetaGenerator = new MetaGenerator();

let meta: Meta = generator.generateMeta();

const packageFileContent: any = JSON.parse(fs.readFileSync(packageFilePath, 'utf8'));

meta.modulVersion = packageFileContent.version;

fs.writeFile(destination, JSON.stringify(meta), 'utf8', (err) => {
    if (err) {
        // tslint:disable-next-line:no-console
        console.error(`Error occured while generating metadata v2 [${JSON.stringify(err)}]`);
    } else {
        // tslint:disable-next-line:no-console
        console.log(`Success - Generated metadata v2 in ${destination}`);
    }

});
