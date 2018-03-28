:: Script to create a new projet in OpenShift to create a testing environnement for modul-components.
:: Ex: create-project.cmd <project-name> <token>
@echo off

set projectName=%1
::set dockerServer=%2
::set dockerUsername=%3
::set dockerPassword=%4
::set dockerEmail=%5
set token=%2

echo Creating project %projectName%...
oc new-project %projectName% --token=%token%

echo Adding template...
oc create -f imagestream.yaml --token=%token%
oc create -f template.yaml --token=%token%


::echo Creation du secret pour Artifactory...
::oc secrets new-dockercfg artifactory --docker-server=%dockerServer% --docker-username=%dockerUsername% --docker-password=%dockerPassword% --docker-email=%dockerEmail% --token=%token%

::echo Creation du lien pour le compte de service par defaut...
::oc secrets link default artifactory --for=pull --token=%token%

::echo Creation du compte de service 
::oc create sa jenkins --token=%token%

::echo Autorisation du compte jenkins...
::oc policy add-role-to-user edit -z jenkins --token=%token%