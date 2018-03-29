:: Script permettant de détruire un projet dans OpenShift
:: Ex: delete-project.cmd <nom du projet> <token>
@echo off

set nomProjet=%1
set token=%2

echo Suppression du projet %nomProjet%...
oc delete project %nomProjet% --token=%TOKEN% --ignore-not-found=true || goto onerror
timeout /T 3 /NOBREAK > nul || goto onerror

exit /b 0

:onerror
echo Script failed.
exit /b 1
