:: Script to create a new projet in OpenShift to create a testing environnement for modul-components.
:: Ex: create-project.cmd <project-name> <token>
@echo off

call delete-project.cmd modul-dv
call create-project.cmd modul-dv || goto onerror

exit /b 0

:onerror
echo Script failed.
exit /b 1