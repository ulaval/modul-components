[![Travis Build Status](https://travis-ci.org/ulaval/modul-components.svg?branch=develop)](https://travis-ci.org/ulaval/modul-components)
[![CircleCI Build Status](https://circleci.com/gh/ulaval/modul-components/tree/develop.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/ulaval/modul-components)
[![npm version](https://badge.fury.io/js/%40ulaval%2Fmodul-components.svg)](https://badge.fury.io/js/%40ulaval%2Fmodul-components)

# modul-components
A set of VueJS components for Modul web applications (beta release).

## Usage
1. Clone this project
1. Run npm run setup
1. Run npm run dev

## Deployment for local usage
1. Run npm pack
1. Add the dependency in your package.json ("@ulaval/modul-components": "file://&lt;path-to&gt;\\ulaval-modul-components-&lt;version&gt;.tgz")

> The `npm pack` command produces multiple .js files along with their definition files (.d.ts), html templates, scss files, etc.

## Usage as a dependency in your project (npm release version)
1. Run npm install @ulaval/modul-components --save
1. Look at the [documentation][1]

[1]: https://ulaval.github.io/modul
