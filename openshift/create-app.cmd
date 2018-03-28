:: Script to create the testing application
:: Ex: create-env.cmd <project name> <branch> <token>
@echo off

set projetName=%1
set branch=%2
set token=%3

echo Creating application %projectName%/%branch%...
oc new-app modul-components -p "NAME=mybranch" -l app=%branch%