:: Script to delete a branch
:: Ex: delete-app.cmd <project name> <branch> <token>
@echo off

set projectName=%1
set branch=%2
set token=%3

echo Deleting %projectName%/%branch%...
oc delete all -n=%projectName% -l app=%branch% --token=%token% --ignore-not-found=true