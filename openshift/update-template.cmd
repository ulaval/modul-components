:: Script to create the testing application
:: Ex: create-env.cmd <project name> <branch> <token>
@echo off

set projetName=%1
set token=%2

echo Creating application %projectName%/%branch%...
oc replace -n=%projectName% -f template.yaml --token=%token% || goto onerror

exit /b 0

:onerror
echo Script failed.
exit /b 1