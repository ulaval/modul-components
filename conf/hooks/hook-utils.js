const fs = require('fs');
const cmd = require('child_process');

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

// Fonctionne avec les noms de branche suivantes
/*
feature/MODUL-9999
bugfix/MODUL-9999
MODUL-9999
*/
const billet = '(MODUL|modul)-[0-9]+';

module.exports = {
    fs: fs,
    cmd: cmd,
    billet: billet,
    billetRegex: new RegExp(billet),
    getBranchname: function (callback) {
        if (!isFunction(callback)) {
            console.log('Erreur dans le code!');
            process.exit(1);
        }
        cmd.exec("git branch | grep \\* | awk '{print $2}'", callback);
    },
    checkErrors: function (err, stderr) {
        if (err || stderr) {
            console.log('Une erreur s\'est produite...');
            if (stderr) {
                console.log(stderr);
            }
            process.exit(1);
        }
    },
    getCommitMsg: function () {
        return fs.readFileSync(process.env.HUSKY_GIT_PARAMS.split(' ')[0]).toString();
    },
}
