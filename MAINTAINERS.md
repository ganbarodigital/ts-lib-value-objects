# MAINTAINERS

The very latest version of this file can always be found in [the template repository](https://github.com/ganbarodigital/ts-lib-template).

- [Branch Layout](#branch-layout)
  - [Gitflow](#gitflow)
- [Unit Testing](#unit-testing)
  - [Testing Tools](#testing-tools)
  - [Code Coverage](#code-coverage)
- [Folder Layout](#folder-layout)
  - [Basic Layout](#basic-layout)
  - [API Versions](#api-versions)
- [Style Guide](#style-guide)
  - [File Header](#file-header)
  - [Code Formatting](#code-formatting)
- [Versioning](#versioning)
  - [Semantic Versioning](#semantic-versioning)
  - [Multi-Variance](#multi-variance)
  -
## Branch Layout

### Gitflow

#### Guidance

This library uses the [Gitflow](http://datasift.github.io/gitflow/) model for managing branches in our Git repository:

Branch | Purpose
-------|--------
`master` | latest tagged release
`develop` | completed features and fixes waiting for final testing and release
`feature/XXX` | work in progress, to be merged into `develop` when completed
`release/XXX` | a release that is undergoing final testing, to be merged into `master` and `develop` when completed
`hotfix/XXX` | emergency bug fixes in progress, to be merged into `master` and released when completed

* Create a new feature branch for each bug fix or new feature.
* Always merge from `develop` into your feature branch right before you create your pull request.
* Create a pull request before merging each feature branch into `develop`.
* Assign the pull request to a milestone in GitHub.
* Always delete the feature branch once the pull request is accepted.
* __Never commit directly to `master`.__

#### Rationale

Gitflow makes it easy for multiple people to work on the same code base at the same time. It isolates work-in-progress, and provides a single source of truth for accepted-work.

It also provides a clear history / audit trail through the list of merged pull requests.

## Unit Testing

### Testing Tools

#### Guidance

This library uses `jasmine` for unit tests, and `nyc` / Istanbul for code coverage metrics. See the [README](README.md) for instructions on how to run these.

#### Rationale

1. We picked `jasmine` because the Angular community use it, and because the resulting unit tests are very easy to read.

### Code Coverage

#### Guidance

* All code merged into the `develop` branch must have (at least) 100% code coverage.
* Hotfixes (by their nature) are emergency releases. Emergency releases are normally time-sensitive. You must try to get 100% code coverage if time allows. If you can't, you must fill in the missing unit tests after the hotfix has been released.

#### Rationale

1. 100% code coverage does not guarantee that we're not shipping bugs. Code that isn't covered by unit tests almost certainly does contain bugs.
2. Type-safety never removes the need for unit testing.
3. It costs more to fix bugs than it does to prevent them.

## Folder Layout

### Basic Layout

#### Guidance

* Library source code goes into `src/` folder.
* The NPM scripts compile the code into the `lib/` folder.
* Unit test code goes into the same folder as the code that it tests.

#### Rationale

* It's a lot easier to keep the Git repo clean if the compiled code is kept separate from the source code.
* It's a lot easier to find unit tests if the test code is co-located with the code that it tests.

### API Versions

#### Guidance

This library uses the _multi-variance_ approach.

* The NPM package contains multiple API versions.
* API source code goes into `src/V1`, `src/V2`, etc etc.
* Each API version needs a `V1/package.json`, `V2/package.json`.

#### Rationale

* Shipping multiple API versions in the one package avoids the Great Guzzle Fiasco from the PHP world.
* Top-level `V1/package.json` etc are the only way to hide the `lib/` folder from `import {} from "..."` statements in end-user code.

## Style Guide

### File Header

Every code file in this library must start with the LICENSE comment.

### Code Formatting

This library uses `tslint` to enforce our preferred code layout. See the [README](README.md) for instructions on how to run the linter.

If you use VS Code as your IDE, it should pick up the linting rules automatically.

## Versioning

### Semantic Versioning

#### Guidance

This library follows [semantic versioning](https://semver.org).

The guiding principle is that a user should be able to upgrade from `v1.0.0` to the latest `v1.x.x` release without having to change their own code.

__Anything that breaks this promise is a backwards-compatibility break__ - even if the SemVer website says otherwise.

#### Rationale

Any future release may include emergency fixes, such as a security fix. For the good of the Internet, it's important that any user can get those fixes with the least amount of effort possible.

### Multi-Variance

#### Guidance

This library also follows the _multi-variance_ approach.

* The NPM package contains all the different, currently-supported API versions.
* The NPM package's __major__ number is the major number of the earliest API that is still supported.

#### Rationale

* Unless the package is trivial, the end-user API will end up changing one day.
* Shipping multiple API versions in the same package reduces duplication.
* It also avoids the Great Guzzle Fiasco from the PHP world.