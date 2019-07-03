Un bouton permet de poser une action dans le site et peut contenir un libellé, une icône ou les deux.

<modul-do>
    <ul>
        <li>L'utilisation d'un bouton est recommandée lorsque l'utilisateur doit poser une action dans le site. Une action permet généralement de débuter, de poursuivre ou d'annuler un processus. Si l'utilisateur désire consulter du contenu dans le site, on utilise un <em><modul-go name="m-link"></modul-go></em> plutôt qu'un bouton.</li>
        <li>Si une icône est utilisé sans libellé l'utilisation du composant <em><modul-go name="m-icon-button"></modul-go></em> est recommandé</li>
    </ul>
</modul-do>

## Caractéristiques

### Traitement visuel

#### Primaire

Un bouton primaire est utilisé pour mettre l'emphase sur la tâche principale ou l'action qui devrait être effectuée par l'utilisateur. Généralement, on retrouve un seul bouton primaire par interface.

<modul-demo>

```html
<m-button>Bouton primaire</m-button>
```
</modul-demo>

#### Secondaire

Un bouton secondaire peut être utilisé pour toute autre action pouvant être effectuée, mais sur laquelle aucun accent n'est mis. De plus, il peut y avoir plusieurs boutons secondaires dans l'interface.

<modul-demo>

```html
<m-button skin="secondary">Bouton secondaire</m-button>
```
</modul-demo>

### États

Trois états sont possibles pour les boutons :

* **Normal&nbsp;:** état initial sans qu'il y ait d'interraction de l'utilisateur.
* **En attente de traitement&nbsp;:** le bouton a été enfoncé et il est en attente de la fin d'un traitement (soumission d'un formulaire par exemple).
* **Désactivé&nbsp;:** les actions sur le bouton sont désactivés, il ne peut pas être utilisé.

#### En attente d'un traitement

Dans certains cas, lors de la soumission d'un formulaire, par exemple, il est important que le bouton soit « désactivé » temporairement jusqu'à ce que le traitement soit exécuté. Durant cette période, le bouton adopte un visuel délavé afin d'indiquer à l'utilisateur que la requête est en traitement et que le bouton ne peut être cliqué à nouveau. Ce comportement est possible autant pour un bouton primaire que secondaire.

<modul-demo>

```html
<m-button :waiting="true">Bouton</m-button>
```
</modul-demo>

#### Désactivé

Généralement, le bouton n'est pas désactivé. En effet, le bouton demeure actif et un message d’erreur est affiché suite au clique. Comme dans le cas des validations d'un formulaire.
Le bouton est désactivé seulement lorsque l’utilisateur ne peut corriger immédiatement la situation (le bouton sera disponible à une date « x », l’utilisateur doit aller dans d’autres sections du site pour fournir de l’information supplémentaire, etc). Lorsque le bouton est désactivé, une précision permettant d’indiquer pourquoi le bouton est inactif est ajoutée.

<modul-demo>

```html
<m-button :disabled="true">Bouton</m-button>
```
</modul-demo>

### Libellé

Lorsque présent, le libellé d'un bouton débute toujours par une lettre majuscule et est généralement un verbe décrivant l'action qui est posée par l'utilisateur. Le verbe est toujours à l'infinitif. Il est possible d'utiliser un nom commun plutôt qu'un verbe lorsqu'il n'est pas possible de trouver un verbe représentant l'action du bouton, mais il doit s'agir d'une exception.

### Icône

Le bouton peut être accompagné d'une icône positionnée soit à droite ou gauche de son libellé.

<modul-demo>

```html
<m-button icon-name="default">Bouton</m-button>
<m-button icon-name="default" icon-position="right">Bouton</m-button>
```
</modul-demo>

### Précision

Le bouton peut être accompagné d'un texte de précision sous le libellé.

<modul-demo>

```html
<m-button>Bouton<span slot="precision">Précision</span></m-button>
<m-button skin="secondary">Bouton<span slot="precision">Précision</span></m-button>
```
</modul-demo>

### Largeur

Le bouton peut prendre la pleine largeur de son conteneur parent.

<modul-demo>

```html
<m-button :full-size="true">Bouton</m-button>
```
</modul-demo>

### Présélection

Règle générale, le bouton primaire est présélectionné. Si l'utilisateur appuie sur la touche « Entrée » sur son clavier, l'action du bouton présélectionné sera exécutée. S'il n'y a aucun bouton primaire dans l'interface, aucun bouton n'est présélectionné.
Dans certains cas, si l'action principale est jugée dangereuse, aucun bouton n'est présélectionné. En effet dans ces situations, il est préférable que l'utilisateur sélectionne lui-même l'action, plutôt que de l'activer en appuyant accidentellement sur la touche « Entrée ».

### Positionnement

* Les boutons sont alignés à gauche lorsqu'ils suivent un formulaire, dans les autres cas ils sont centrés.
* Ils sont alignés côte à côte lorsque l'espace est suffisant. S'il n'est pas possible de tous les aligner côte à côte sur une seule ligne, ils sont affichés les uns en dessous des autres.
* Dans le cas où plusieurs boutons sont affichés, ils doivent tous être de même largeur, soit la largeur du bouton le plus large.
* Le bouton primaire est toujours présenté en premier (soit le plus à gauche, soit le plus en haut selon la disposition).
