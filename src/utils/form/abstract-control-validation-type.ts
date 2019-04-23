/**
 * @see https://wiki.dti.ulaval.ca/pages/viewpage.action?spaceKey=MODUL&title=Gestion+des+erreurs
 */
export enum AbstractControlValidationType {
    Optimistic = 'optimistic',
    OnGoing = 'on-going',
    Correctable = 'correctable',
    AtExit = 'at-exit'
}
