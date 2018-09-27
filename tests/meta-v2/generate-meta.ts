import * as fs from 'fs';

import { Meta } from '../../src/meta/v2';
import { MetaGenerator } from './meta-generator';

let destination: string = process.argv[2];

// tslint:disable-next-line:no-console
console.log(`Generating metadata v2...`);

const generator: MetaGenerator = new MetaGenerator();

let meta: Meta = generator.generateMeta();

fs.writeFile(`${destination}/modul-meta.json`, JSON.stringify(meta), 'utf8', (err) => {
    if (err) {
        // tslint:disable-next-line:no-console
        console.error(`Error occured while generating metadata v2 [${JSON.stringify(err)}]`);
    } else {
        // tslint:disable-next-line:no-console
        console.log(`Success - Generated metadata v2 in ${destination}/modul-meta.json`);
    }

});
