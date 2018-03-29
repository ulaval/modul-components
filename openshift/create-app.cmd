:: Script to create the testing application
:: Ex: create-env.cmd <project name> <branch> <token>
@echo off

set projetName=%1
set branch=%2
set token=%3

set name=%branch:/=-%

echo Creating application %projectName%/%name%...
oc new-app modul-components -n=%projectName% -p NAME=%name% -p SOURCE_REPOSITORY_REF=%branch% -l app=%name% --token=%token% || goto onerror

exit /b 0

:onerror
echo Script failed.
exit /b 1