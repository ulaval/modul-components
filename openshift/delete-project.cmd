:: Script permettant de détruire un projet dans OpenShift
:: Ex: delete-project.cmd <nom du projet> <token>
@echo off

set nomProjet=%1
set token=%2

echo Suppression du projet %nomProjet%...
oc delete project %nomProjet% --token=%TOKEN% --now --ignore-not-found=true
timeout /T 3 /NOBREAK > nul
