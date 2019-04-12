#!/usr/bin/env groovy

pipeline {
    agent any

    options {
        // Discarter après 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))

        // Ajouter les timestamps dans le log
        timestamps()
    }

    environment {
        // Pour éviter une erreur: EACCES: permission denied, mkdir '/.npm'
        npm_config_cache = 'npm-cache'
        DOCKER_REPOSITORY = 'docker-local.maven.at.ulaval.ca/modul'
        DOCKER_REPOSITORY_URL = 'https://docker-local.maven.at.ulaval.ca'
    }

    stages {
        stage('Build') {
            when {
                expression {
                    env.BRANCH_NAME=='master' || env.BRANCH_NAME=='develop'
                }
            }

            agent {
                docker {
                    image 'node:9.4.0'
                }
            }

            steps {
                sh 'npm ci'
                sh 'npm run buildWebpack'
                // Probablement une étape de publish ici.
            }
        }
    }

    stages {
        stage('Test') {
            when {
                expression {
                    env.BRANCH_NAME=='master' || env.BRANCH_NAME=='develop'
                }
            }

            agent {
                docker {
                    image 'node:9.4.0'
                }
            }

            steps {
                sh 'npm ci'
                sh 'npm run buildWebpack'
                sh 'npm run test'
            }
        }
    }

    post {
        changed {
            echo 'Build status changed'
            step([$class: 'Mailer', recipients: ['martin.simard@dti.ulaval.ca', emailextrecipients([[$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider']])].join(' ')])
        }
        failure {
            echo 'Build failure'
            step([$class: 'Mailer', recipients: ['martin.simard@dti.ulaval.ca', emailextrecipients([[$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider']])].join(' ')])
        }
        unstable {
            echo 'Build unstable'
            step([$class: 'Mailer', recipients: ['martin.simard@dti.ulaval.ca', emailextrecipients([[$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider']])].join(' ')])
        }
    }
}

