/**
 * @see https://wiki.dti.ulaval.ca/pages/viewpage.action?spaceKey=MODUL&title=Gestion+des+erreurs
 */
export enum AbstractControlValidationType {
    None = 'none',
    AtExit = 'at-exit',
    Correction = 'correction',
    Modification = 'modification',
    OnGoing = 'on-going'
}
