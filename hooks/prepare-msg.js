const utils = require('./hook-utils');

function modifierCommitMsg(msg) {
    utils.fs.writeFileSync(process.env.HUSKY_GIT_PARAMS.split(' ')[0], msg);
    console.log(`Le message du commit a été modifié : ${utils.getCommitMsg()}`);
}

function ajouterBillet(commitMsg, billet) {
    let auMoinsUnBillet = utils.billetRegex.exec(commitMsg) != null;

    if (auMoinsUnBillet) {
        commitMsg = `${billet}, ${commitMsg}`;
    } else {
        commitMsg = `${billet} - ${commitMsg}`;
    }

    modifierCommitMsg(commitMsg);
}

utils.getBranchname((err, stdout, stderr) => {
    let numBilletDansBranche = utils.billetRegex.exec(stdout);
    let commitMsg = utils.getCommitMsg();

    if (numBilletDansBranche == null) {
        console.log('Le nom de votre branche ne permet pas de préparer le message du commit.');
        console.log('L\'identifiant de billet JIRA est introuvable.');
    } else {
        const billetRegex = new RegExp(numBilletDansBranche[0].toUpperCase());
        const billetDeBrancheDejaDansCommitMsg = billetRegex.test(commitMsg.toUpperCase());

        if (!billetDeBrancheDejaDansCommitMsg) {
            ajouterBillet(commitMsg, numBilletDansBranche[0].toUpperCase());
        } else {
            console.log('Le message du commit ne nécessite pas de modification.');
        }
    }
});
