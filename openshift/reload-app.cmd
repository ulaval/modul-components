:: Script to create a new projet in OpenShift to create a testing environnement for modul-components.
:: Ex: create-project.cmd <project-name> <token>
@echo off

set projetName=%1
set branch=%2
set token=%3

call delete-app.cmd "%projectName%" "%branch%" %token% || goto onerror
call update-template.cmd "%projectName%" %token% || goto onerror
call create-app.cmd "%projectName%" "%branch%" %token% || goto onerror

exit /b 0

:onerror
echo Script failed.
exit /b 1