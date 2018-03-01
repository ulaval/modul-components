let fs = require('fs');

let start = Date.now();

let source = process.argv[2];
let destination = process.argv[3];

console.log('Generating meta files...');

readFolders(source, (root, path, done) => {
    let errors = [];
    read(`${root}/${path}.ts`, source => {
        let meta = {
            attributes: {},
            mixins: [],
            enums: {}
        };

        createProps(meta, source, errors);
        createMixins(meta, source, errors);
        createEnums(meta, source, errors);

        write(`${destination}/${path}/${path}.meta.json`, meta, _ => {
            done(errors);
        }, err => {
            errors.push(err.message);
            done(errors);
        });
    }, err => {
        errors.push(err.message);
        done(errors);

    });
});

function createProps(meta, source, errors) {
    let prop = undefined;
    const propRegExp = new RegExp(/@Prop\(([\s\S]*?)\)\s*(?:@Model\(\'?[\w\d]+\'?\)\s*)?public\s*(\w*)\??:\s*(\w\s|.*);/, 'g');
    do {
        prop = propRegExp.exec(source);
        if (prop) {
            let propName = prop[2];
            let propType = prop[3];
            meta.attributes[propName] = {
                type: propType
            }
        }
    } while (prop);
}

function createMixins(meta, source, errors) {
    const mixinsRegExp = new RegExp(/mixins:\s*\[([\s\S]*?)\]/);
    let match = mixinsRegExp.exec(source);
    if (match) {
        let mixinMatch = undefined;
        const mixinNameRegExp = new RegExp(/([\w\d]+)/, 'g');
        do {
            mixinMatch = mixinNameRegExp.exec(match[1]);
            if (mixinMatch) {
                let mixin = mixinMatch[1];
                meta.mixins.push(mixin);
            }
        } while (mixinMatch);
    }
}

function createEnums(meta, source, errors) {
    let match = undefined;
    const enumRegex = new RegExp(/export enum ([\w\d]+)\s+{([\s\S]*?)}/, 'g');
    do {
        match = enumRegex.exec(source);
        if (match) {
            let enumName = match[1];
            let enumValuesMatch = undefined;
            let enumValues = [];
            const enumValuesRegExp = new RegExp(/'([\w\d]+)'/, 'g');
            do {
                enumValuesMatch = enumValuesRegExp.exec(match[2]);
                if (enumValuesMatch) {
                    enumValues.push(enumValuesMatch[1]);
                }
            } while (enumValuesMatch);
            meta.enums[enumName] = enumValues;
        }
    } while (match);
}

function readFolders(folder, cb) {
    let exitCode = 0;
    let toComplete = {};
    let failed = 0;
    let total = 0;

    fs.readdir(folder, (err, files) => {
        if (err) {
            throw err;
        }
        files.forEach(file => {
            let fullpath = folder + '/' + file;
            if (fs.statSync(fullpath).isDirectory()) {
                toComplete[file] = false;
                total++;

                let done = errors => {
                    if (errors.length === 0) {
                        logSuccess(file);
                    } else {
                        exitCode = 1;
                        failed++;
                        logError(file);
                        errors.forEach(error => logErrorIndent(error));
                    }
                    // console.log();
                    delete toComplete[file];
                    if (Object.keys(toComplete).length === 0) {
                        let end = Date.now();

                        console.log(`Processed ${total} files in ${(end - start) / 1000} secs`);
                        let status = `TOTAL: ${failed} FAILED, ${total - failed} SUCCESS`;
                        internalLog(false, failed === 0 ? 32 : 31, status);

                        console.log();
                        process.exit(exitCode);
                    }
                };
                cb(fullpath, file, done);
            }
        });
    });
};

function read(file, cb, cbError) {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            cbError(err);
        } else {
            cb(data);
        }
    });
}

function write(file, meta, cb, cbError) {
    fs.writeFile(file, JSON.stringify(meta), 'utf8', (err) => {
        if (err) {
            cbError(err);
        } else {
            cb();
        }
    });
}

function internalLog(indent, colorCode, char, ...params) {
    let c = indent ? '    ' + char : char;
    console.log(`\x1b[${colorCode}m%s\x1b[0m`, c, ...params);
}

function logSuccess(...params) {
    internalLog(false, 32, '✓', ...params);
}

function logError(...params) {
    internalLog(false, 31, 'x', ...params);
}

function logErrorIndent(...params) {
    internalLog(true, 31, 'x', ...params);
}
