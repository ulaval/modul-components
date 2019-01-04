const utils = require('./hook-utils');

if (process.argv.length > 2) {
    console.log(`Vérification du nom de la branche: ${process.argv[2]}`);
    checkBranchname(process.argv[2]);
} else {
    utils.getBranchname((err, stdout, stderr) => {
        utils.checkErrors(err, stderr);
        checkBranchname(stdout.trim());
    });
}

function checkBranchname(branche) {
    const regex = new RegExp('^master$|^develop$|^(feature|bugfix|hotfix|misc)\/' +
        utils.billet +
        '_([a-zA-Z0-9]|_|-)+$|^release\/rc-[0-9]{2}-[0-9]{2}-[0-9]{2}$');

    if (!regex.test(branche)) {
        console.log(`Le nom de la branche "${branche}" ne respecte pas ce format : ${regex}`);
        process.exit(1);
    }
}
