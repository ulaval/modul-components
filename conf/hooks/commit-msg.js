const utils = require('./hook-utils');

const commitMessage = utils.getCommitMsg();

if (!commitMessage) {
    console.log('Une erreur s\'est produite lors de la vérification du message du commit.');
    process.exit(1);
}

utils.getBranchname((err, stdout, stderr) => {
    const numBilletDansBranche = utils.billetRegex.exec(stdout);

    if (numBilletDansBranche != null && !new RegExp(numBilletDansBranche[0].toUpperCase()).test(commitMessage.toUpperCase())) {
        console.log(`Le message du commit ne contient pas le numéro du billet Jira de la branche courante : ` + numBilletDansBranche[0]);
        process.exit(1);
    }
});
