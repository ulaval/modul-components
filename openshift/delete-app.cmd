:: Script to delete a branch
:: Ex: delete-app.cmd <project name> <branch> <token>
@echo off

set projectName=%1
set branch=%2
set token=%3

set name=%branch:/=-%

echo Deleting %projectName%/%name%...
oc delete all -n=%projectName% -l app=%name% --ignore-not-found=true --token=%token% || goto onerror

exit /b 0

:onerror
echo Script failed.
exit /b 1