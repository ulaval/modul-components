let fs = require('fs');

const pascalCaseRegExp = new RegExp(/-([a-z])/, 'g');

let tag = process.argv[2];
let fileName = tag.substr(2); // strip m-
let className = toPascalCase(tag);
let plugin = className.substring(1);
let constant = toConstant(tag).substring(2) + '_NAME';

const TS = 'ts';
const SPEC = 'spec';
const LANG = 'lang';
const SANDBOX = 'sandbox';

let items = {
    [TS]: false,
    [SPEC]: false,
    [LANG]: false,
    [SANDBOX]: false
};

let all = false;

if (process.argv.length == 3) {
    all = true;
    Object.getOwnPropertyNames(items).forEach(p => items[p] = true);
} else {
    process.argv.slice(3).forEach(i => items[i] = true);
}

console.log(`creating component ${tag}`);

console.log();
console.log('The following steps need to be completed manually:');
if (items[TS]) {
    console.log(`Declare ${constant} in component-names.ts`);
    console.log(`Install the ${plugin} plugin in the components index.ts`);
    console.log(`Add Components.${constant} in meta-init.ts`);
}

if (items[SANDBOX]) {
    console.log(`Install the ${plugin} sandbox plugin in the sanboxes index.ts`);
}

if (items[LANG]) {
    console.log(`Require the ${fileName}.lang.fr.json file in fr.ts`);
}

console.log();
console.log('generating files...');

if (all) {
    fs.mkdir(`./src/components/${fileName}`, (err) => {
        if (err) {
            console.log('an error occured', err);
        } else {
            doCreateFiles();
        }
    });
} else {
    doCreateFiles();
}

function doCreateFiles() {
    if (items[TS]) {
        write(`./src/components/${fileName}/${fileName}.ts`, 'component-template.ts', () => console.log('ts done'), (e) => console.log(e));
        write(`./src/components/${fileName}/${fileName}.html`, 'component-template.html', () => console.log('html done'), (e) => console.log(e));
    }
    if (items[SPEC]) {
        write(`./src/components/${fileName}/${fileName}.spec.ts`, 'component-template.spec.ts', () => console.log('spec done'), (e) => console.log(e));
    }
    if (items[LANG]) {
        write(`./src/components/${fileName}/${fileName}.lang.fr.json`, 'component-template.lang.fr.json', () => console.log('language fr done'), (e) => console.log(e));
    }
    if (items[SANDBOX]) {
        write(`./src/components/${fileName}/${fileName}.sandbox.ts`, 'component-template.sandbox.ts', () => console.log('sandbox ts done'), (e) => console.log(e));
        write(`./src/components/${fileName}/${fileName}.sandbox.html`, 'component-template.sandbox.html', () => console.log('sandbox html done'), (e) => console.log(e));
    }
}

function write(file, template, cb, cbError) {
    fs.readFile(`./tests/meta/${template}`, 'utf8', (err, data) => {
        if (err) {
            cbError(err);
        } else {
            let content = data
                .replace(/{{tag}}/g, tag)
                .replace(/{{file}}/g, fileName)
                .replace(/{{class}}/g, className)
                .replace(/{{plugin}}/g, plugin)
                .replace(/{{constant}}/g, constant);
            fs.writeFile(file, content, 'utf8', (err) => {
                if (err) {
                    cbError(err);
                } else {
                    cb();
                }
            });
        }
    })
}

function toPascalCase(s) {
    let result = '';
    let match = pascalCaseRegExp.exec(s);
    let index = 0;
    while (match) {
        if (index === 0) {
            result += s[0].toUpperCase();
            index++;
        }
        result += s.substring(index, match.index);
        result += match[1].toUpperCase();
        index = match.index + 2;
        match = pascalCaseRegExp.exec(s);
    }
    if (index < s.length) {
        result += s.substr(index);
    }
    return result;
}

function toConstant(s) {
    return s.toUpperCase().replace(/-/g, '_');
}
