:: Script to create a new projet in OpenShift to create a testing environnement for modul-components.
:: Ex: create-project.cmd <project-name> <token>
@echo off

set projectName=%1
set token=%2

echo Creating project %projectName%...
oc new-project %projectName% --token=%token% || goto onerror

echo Adding template...
oc create -f imagestream.yaml --token=%token% || goto onerror
oc create -f template.yaml --token=%token% || goto onerror

echo Creating jenkins service account...
oc create sa jenkins --token=%token% || goto onerror

echo Granting edit role to jenkins service account...
oc policy add-role-to-user edit -z jenkins --token=%token% || goto onerror

exit /b 0

:onerror
echo Script failed.
exit /b 1