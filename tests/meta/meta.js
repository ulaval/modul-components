let fs = require('fs');

const propRegExp = new RegExp('@Prop\\(([{}=>:.,|\'\\w\\d\\s]*)\\)\\s*public\\s*(\\w*):\\s*(\\w*);', 'g');

readFolders('./src/components', (folder, done) => {
    let errors = [];
    read(`./src/components/${folder}/${folder}.ts`, source => {
        read(`./src/components/${folder}/${folder}.meta.json`, rawMeta => {
            let meta = JSON.parse(rawMeta);

            if (!meta.attributes) {
                errors.push(`meta has no attributes`);
            } else {

                let prod = undefined;
                do {
                    prop = propRegExp.exec(source);
                    if (prop) {
                        if (meta.attributes[prop[2]] === undefined) {
                            errors.push(`${prop[2]} not found in meta`);
                        } else {
                            delete meta.attributes[prop[2]];
                        }
                    }
                }
                while (prop);

                Object.keys(meta.attributes).forEach(attribute => {
                    errors.push(`${attribute} is not a component property`);
                })
            }

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

function readFolders(folder, cb) {
    let exitCode = 0;
    let toComplete = {};
    fs.readdir(folder, (err, files) => {
        if (err) {
            throw err;
        }
        files.forEach(file => {
            if (fs.statSync(folder + '/' + file).isDirectory()) {
                toComplete[file] = false;

                let done = errors => {
                    if (errors.length === 0) {
                        logSuccess(file);
                    } else {
                        exitCode = 1;
                        logError(file);
                        errors.forEach(error => logErrorIndent(error));
                    }
                    console.log();
                    delete toComplete[file];
                    if (Object.keys(toComplete).length === 0) {
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
