# CHANGELOG

## Introduction

This CHANGELOG tells you:

* when a release was made
* what is in each release

It also tells you what changes have been completed, and will be included in the next tagged release.

For each release, changes are grouped under these headings:

* _Backwards-Compatibility Breaks_: a list of any backwards-compatibility breaks
* _New_: a list of new features. If the feature came from a contributor via a PR, make sure you link to the PR and give them a mention here.
* _Fixes_: a list of bugs that have been fixed. If there's an issue for the bug, make sure you link to the GitHub issue here.
* _Dependencies_: a list of dependencies that have been added / updated / removed.
* _Tools_: a list of bundled tools that have been added / updated / removed.

## develop branch

The following changes have been completed, and will be included in the next tagged release.

## v1.1.0

Released Wednesday, 19th February 2020.

### Backwards-Compatibility Breaks

We've introduced a `v2` API, to correct some mistakes we made in the design of the `V1` API.

* The `ValueObject` interface is now called `Value`
* The `Value` class is now called `ValueObject`
* `OnError` callbacks now use the `ts-lib-error-reporting` format

The old `V1` API remains available too, inside this package. It'll get bug fixes, but otherwise is frozen.

### New

* Added `Entity` interface to v2 API
* Added `EntityObject` to v2 API

## v1.0.1

Released Sunday, 2nd February 2020.

### Fixes

* `ValueObject.isValue()` now returns `this is ValueObject<T>`, to help with creating value objects that wrap structs.

## v1.0.0

Released Wednesday, 29th January 2020.

### New

* Added `TypeGuard` function type
* Added `DataGuard` function type
* Added `DataGuarantee` function type
* Added `DataCoercion` function type
* Added `ValueObject` interface
* Added `Value` base class
* Added `Branded` type
* Added `RefinedTypeFactory` function
* Added `makeRefinedTypeFactory` function
* Added `RefinedType` class
* Added `RefinedPrimitive` class
* Added `RefinedNumber` class
* Added `RefinedString` class
