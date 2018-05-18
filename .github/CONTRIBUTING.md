Je veux les instructions en [français](#fr)

## `@ulaval\modul-components`
# Contributing Guide

Before submitting your contribution, please read the following guidelines.

- English instructions coming soon...

# Project Structure

**conf**: Contains configuration files (webpack, linters, etc.).

**src/assets**: Contains public assets not related for a particular component (e.g. icons).

**src/components**: Contains a folder for each component.

**src/components/index.ts**: Plugin that will install all the components.

**src/components/--name--/name.ts**: Component code.

**src/components/--name--/name.html**: Component html template.

**src/components/--name--/name.scss**: Component sass file.

**src/components/--name--/name.lang.xx.json**: Component ressource file for the xx language.

**src/components/--name--/name.spec.ts**: Component unit tests.

**src/directives/**: Contains a folder for each directive. The structure is the same than for components.

**src/lang**: Contains all the language bundles.

**src/mixins**: Contains mixins used by the components.

**src/styles**: Contains common style classes, mixins, etc.

**src/utils**: Contains utility classes and services.

**tests**: Contains debug templates, common test helpers, classes, etc.

# <a name="fr"></a>Instructions à suivre pour les contributeurs

Avant de soumettre votre contribution, veuillez prendre note de ces quelques lignes directrices.

- Lire à propos de la [structure du projet](#psfr).
- Créer une *feature branch* à partir de la branche désirée (typiquement `develop`). Le projet `modul-components` suit la convention [Git Flow](http://nvie.com/posts/a-successful-git-branching-model/). Le nom de votre branche devrait débuter par *feature-* ou *feature/*.
- À moins d'avoir à modifier la structure même du projet, le code touché par le *pull request* (PR) ne devrait concerner que le répertoire `src`.
- S'assurer que votre code compile (`npm run dev` ou `npm run buildWebpack`).
- S'assurer que les tests s'exécutent avec succès (`npm run unitall`).
- S'il s'agit d'une correction de bogue:
    - Avoir préalablement créé un billet (*issue*) dans Github*.
    - Indiquer le # du billet dans le nom du PR.
    - Lier le problème dans le contenu du PR.
    - Ajouter la couverture de code nécessaire.
- S'il s'agit d'une nouvelle fonctionnalité:
    - Suivre les mêmes indications que pour la correction de bogues. Les nouvelles fonctionnalités devraient avoir été **préalablement approuvées** via un billet de type **Suggestion**.
- Si possible, identifier une ou plusieurs ressources pour procéder à la revue de code.
- Plusieurs *commits* peuvent être effectués au cours du processus d'approbation d'un PR. Un *squash merge* est effectué lorsque le code est rapporté dans la branche `develop`.
- Il est possible de faire valider fonctionnellement son PR en demandant que la branche soit déployée dans un environnement de test (option du formulaire de PR).

*Pour les contributeurs internes au projet, le billet sera créé dans JIRA.

## Documentation technique des composantes

- à venir

# <a name="psfr"></a>Structure du projet

**conf**: Contient les fichiers de configuration (webpack, linters, etc.).

**src/assets**: Contient les ressources publiques qui ne sont pas reliées directement à une composante en particulier (ex: icônes).

**src/components**: Contient un répertoire pour chacune des composantes.

**src/components/index.ts**: Plugin qui permet l'installation de toutes les composantes à la fois.

**src/components/--name--/name.ts**: Code de la composante.

**src/components/--name--/name.html**: Gabarit html de la composante.

**src/components/--name--/name.scss**: Fichier sass de la composante.

**src/components/--name--/name.lang.xx.json**: Ficher de ressources de la composante pour la langue xx.

**src/components/--name--/name.spec.ts**: Tests unitaires de la composante.

**src/directives/**: Contient un répertoire pour chacune des directives. La structure est la même que celle des composantes.

**src/lang**: Contient les plugins pour chacune des langues.

**src/mixins**: Contient les mixins utilisées par les composantes.

**src/styles**: Contient les classes de styles, mixins, etc. communes à toutes les composantes.

**src/utils**: Contient les classes utilitaires ainsi que les services.

**tests**: Contient les gabarits, classes utilitaires pour les tests, etc.
