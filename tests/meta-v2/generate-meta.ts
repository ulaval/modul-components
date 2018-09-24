import { MetaGenerator } from './meta-generator';
import { Meta } from './meta-model';

let source: string = process.argv[2];
let destination: string = process.argv[3];

// tslint:disable-next-line:no-console
console.log(`Generating metadata for ${source}`);

const generator: MetaGenerator = new MetaGenerator(source);

let meta: Meta = generator.generateMeta();

// tslint:disable-next-line:no-console
console.log(JSON.stringify(meta));
