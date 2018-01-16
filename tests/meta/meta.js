let fs = require('fs');

let start = Date.now();
const propRegExp = new RegExp('@Prop\\(([\\s\\S]*?)\\)\\s*public\\s*(\\w*):\\s*(\\w*);', 'g');
const mixinsRegExp = new RegExp('mixins:\\s*\\[([\\s\\S]*?)\\]', 'g');
const mixinNameRegExp = new RegExp('[\\w\\d]+', 'g');

readFolders('./src/components', (folder, done) => {
    let errors = [];
    read(`./src/components/${folder}/${folder}.ts`, source => {
        read(`./src/components/${folder}/${folder}.meta.json`, rawMeta => {
            let meta = JSON.parse(rawMeta);

            validateMeta(meta, source, errors);
            validateMixins(meta, source, errors);

            done(errors);
        }, err => {
            errors.push(err.message);
            done(errors);
        })
    }, err => {
        errors.push(err.message);
        done(errors);
    });
});

function validateMeta(meta, source, errors) {
    let prop = undefined;
    do {
        prop = propRegExp.exec(source);
        if (prop) {
            if (meta.attributes && meta.attributes[prop[2]] !== undefined) {
                delete meta.attributes[prop[2]];
            } else {
                errors.push(`Property ${prop[2]} not found in meta`);
            }
        }
    }
    while (prop);

    if (meta.attributes) {
        Object.keys(meta.attributes).forEach(attribute => {
            errors.push(`Property ${attribute} is not used by the component`);
        });
    }
}

function validateMixins(meta, source, errors) {
    meta.mixinsObj = {}; // used as map for validation
    if (meta.mixins) {
        meta.mixins.forEach(mixin => meta.mixinsObj[mixin] = true);
    }

    let match = mixinsRegExp.exec(source);
    if (match) {
        let mixin = undefined;
        do {
            mixin = mixinNameRegExp.exec(match[1]);
            if (mixin) {
                if (meta.mixinsObj[mixin] === undefined) {
                    errors.push(`Mixin ${mixin} not found in meta`);
                } else {
                    delete meta.mixinsObj[mixin];
                }
            }
        }
        while (mixin);
    }

    Object.keys(meta.mixinsObj).forEach(mixin => {
        errors.push(`Mixin ${mixin} is not used by the component`);
    });
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
            if (fs.statSync(folder + '/' + file).isDirectory()) {
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
                    console.log();
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
                cb(file, done);
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
