# Value Objects for Typescript

## Introduction

This TypeScript library will help you create value objects and type refinements. They will help you write safer software.

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [General Concepts](#general-concepts)
  - [An Example: UUIDs](#an-example-uuids)
- [Foundation Types](#foundation-types)
  - [Type Guard](#type-guard)
  - [Data Guard](#data-guard)
  - [Data Guarantee](#data-guarantee)
  - [Data Coercion](#data-coercion)
- [Value Objects](#value-objects)
  - [What Is A Value Object?](#what-is-a-value-object)
  - [How To Build Value Objects](#how-to-build-value-objects)
  - [Advantages Of Value Objects](#advantages-of-value-objects)
  - [Disadvantages Of Value Objects](#disadvantages-of-value-objects)
- [Type Refinements](#type-refinements)
  - [What Is A Type Refinement?](#what-is-a-type-refinement)
  - [Type Branding](#type-branding)
  - [Type Flavouring](#type-flavouring)
  - [How To Declare A Type Refinement](#how-to-declare-a-type-refinement)
  - [Advantages Of Type Refinement](#advantages-of-type-refinement)
  - [Disadvantages Of Type Refinement](#disadvantages-of-type-refinement)
- [V1 API](#v1-api)
  - [CoercedNumber](#coercednumber)
- [NPM Scripts](#npm-scripts)
  - [npm run clean](#npm-run-clean)
  - [npm run build](#npm-run-build)
  - [npm run test](#npm-run-test)
  - [npm run cover](#npm-run-cover)

## Quick Start

```
# run this from your Terminal
npm install @ganbarodigital/ts-lib-value-objects
```

```typescript
// add this import to your Typescript code
import { RefinedString } from "@ganbarodigital/ts-lib-value-objects/V1"
```

__VS Code users:__ once you've added a single import anywhere in your project, you'll then be able to auto-import anything else that this library exports.

## General Concepts

The basic idea behind _value objects_ and _type refinements_ is to use TypeScript's type system to reduce the amount of runtime checks we need.

How do we do this?

* We take all of the `isXXX()` kind of checks that are scattered around our code, and put them into constructors / type factories instead.
* That way, the checks run once (when we create the value), and don't have to run again when we pass the value into functions and methods (because TypeScript knows the value is safe).

### An Example: UUIDs

For example, a universally-unique ID (or UUID for short) is a string that contains a mixture of hexadecimal values and some '-' separator characters. The string must be 36 characters long, and the separators must be in specific places in the string. And there's some rules about the values of some of the hexadecimal characters too.

We can say that "all UUIDs are strings", but we cannot say that "all strings are UUIDs". What do we mean?

* We can use a `UUID`'s value as a parameter to any function or method that expects a `string`, and that function / method will work as expected.
* But if we pass any old string into a function / method that expects a `UUID`, the function / method won't work as expected.

In pure JavaScript (and many other weakly-typed languages!), each function / method would have to call an `isUUID(input)` function first, just to protect itself from a bad input. A call to `isUUID()` is a _runtime check_: it happens every time the function / method calls. There's a performance cost to runtime checks, and that cost adds up very quickly.

We want to use TypeScript to make all of that go away. And there's two ways to do that:

* we can build a `Uuid` class, and create _value objects_, or
* we can create a `Uuid` "branded" string, known as a _type refinement_

Both options give you a `Uuid` type, that you can then use across your TypeScript code:

```typescript
function doSomething(uuid: Uuid) { /* ... */ }

// uuid1 is a value object
const uuid1 = Uuid.from("123e4567-e89b-12d3-a456-426655440000");

// this works
doSomething(uuid1);

// this produces a TypeScript compile error
doSomething("123e4567-e89b-12d3-a456-426655440000");
```

or

```typescript
function doSomething(uuid: Uuid) { /* ... */ }

// uuid2 is a type refinement
// it's actually a 'branded' string, and not an object
const uuid2 = uuidFrom("123e4567-e89b-12d3-a456-426655440000");

// this works
doSomething(uuid2);

// this produces a TypeScript compile error
doSomething("123e4567-e89b-12d3-a456-426655440000");
```

Each approach has pros and cons, and we'll cover those below.

Whichever approach you decide suits you the best, this library makes it easy to adopt.

## Foundation Types

Both _value objects_ and _type refinements_ rely on a group of underlying, foundational types. We use these types to describe the functions that our _smart constructors_ call.

### Type Guard

A _type guard_ is a function that tells the TypeScript compiler to treat a value as a given type.

```typescript
import { TypeGuard } from "@ganbarodigital/ts-lib-value-objects/V1";

const isUuidType: TypeGuard<Uuid> = (input: unknown) => input is Uuid {
    if (input instanceof Uuid) {
        return true;
    }

    return false;
}
```

Type guards are a TypeScript language feature. They're an essential part of getting the benefits of using TypeScript over plain Javascript.

```typescript
if (isUuidType(input)) {
    // TypeScript will let you access all the methods of `Uuid` now
} else {
    // TypeScript knows that `input` is NOT a `Uuid` here
}
```

Notes:

* we recommend ending your type guards with the word `Type`, to tell them apart from _data guards_.

We've added the `TypeGuard` type for completeness. It's handy if you've got a factory that needs a type guard as an input parameter.

### Data Guard

A _data guard_ is a function. It inspects the given data, and returns `true` if the data matches its internal rule(s). It returns `false` otherwise.

Data guards are an example of a _contract_ or _specification_, depending on what programming paradigm you subscribe to :)

```typescript
import { DataGuard } from "@ganbarodigital/ts-lib-value-objects/V1";

const isUuidData: DataGuard<string> = (input: string): boolean {
    if (input.length === 36) {
        return true;
    }

    return false;
}
```

Notes:

* keep your data guards as short as possible, so that they're as reusable as possible
* ideally, each data guard should check just one thing. You can build stricter data guards by composing multiple, smaller, guards together.

### Data Guarantee

A _data guarantee_ is a function. It enforces a _contract_ or _specification_. It inspects the given input, and if the input doesn't meet the contract / specification, it calls the supplied `OnError` handler.

The `OnError` handler decides which `Error` to throw. The `OnError` handler _always_ throws an `Error` of some kind.

```typescript
import { OnError } from "@ganbarodigital/ts-on-error/V1";
import { DataGuarantee } from "@ganbarodigital/ts-lib-value-objects/V1";

const invalidUuid = Symbol("invalidUuid");

const mustBeUuid: DataGuarantee<string> = (input: string, onError: OnError): void {
    // does the string contain a well-formatted UUID?
    if (!isUuidData(input)) {
        onError(invalidUuid, "input is not a well-formatted UUID", {input: input});
    }

    // if we get here, all is well
}
```

There's a lot going on here. Let's break it down:

* each error gets its own unique identifier. We're creating `symbol`s for those. They help the `OnError` handler cope with different types of errors.
* the `OnError` handler is a callback that you provide
  - its job is to decide what to do about the reported error
* the `OnError` handler takes three parameters:
  - a unique ID for the error
  - a description of the error
  - extra information about the error
* `DataGuarantee` is a generic type. By default, it expects the function's input to be `unknown`, and it expects the function to send an `object` as the final parameter to the `OnError` handler
  - you can change these to suit, e.g. `DataGuarantee<string, InvalidUuid>`

Data guarantees get used in so-called _smart constructors_:

```typescript
import { OnError } from "@ganbarodigital/ts-on-error";
import { RefinedString } from "@ganbarodigital/ts-lib-value-objects";

// this is the value object approach
class Uuid extends RefinedString {
    // `from()` is our smart constructor
    public static from(input: string, onError?: OnError): Uuid {
        // make sure we have an error handler
        onError = onError ?? defaultUuidErrorHandler;

        // we tell our parent class' constructor which
        // data guarantee and error handler to use, and
        // it takes care of all the necessary calls
        return new Uuid(input, mustBeUuid, onError);
    }
}

// call the 'smart constructor' to create the value
// `uuid` is an object, and an instanceof Uuid
let uuid = Uuid.from("123e4567-e89b-12d3-a456-426655440000");
```

```typescript
import { OnError } from "@ganbarodigital/ts-on-error";
import { Branded, makeTypeRefinementFactory } from "@ganbarodigital/ts-lib-value-objects";

// this is an example of "type refinement", using a "branded" string
type Uuid = Branded<string, "uuid">;

// TypeScript can't infer this type
// so we have to define it manually
type UuidBuilder = (input: string, onError?: OnError) => Uuid;

// uuidFrom() is a 'smart constructor'
const uuidFrom: UuidBuilder = makeTypeRefinementFactory(
    mustBeUuid,
    defaultUuidErrorHandler,
);

// call the 'smart constructor' to create the value
//
// `uuid` is a string in plain Javascript
// TypeScript sees it as an Intersection type
let uuid = uuidFrom("123e4567-e89b-12d3-a456-426655440000");
```

### Data Coercion

A _data coercion_ is a function. It enforces a _contract_ or _specification_. It inspects the given input, and if the input doesn't meet the contract / specification, it calls the supplied `OnError` handler. (So far, that's exactly the same as a _data guarantee_.)

The `OnError` handler can do one of two things:

- it can return a value that does meet the contract / specification (this is new!), or
- it can throw an `Error` of some kind (just like an `OnError` handler for a _data guarantee_)

```typescript
import { OnError } from "@ganbarodigital/ts-on-error/V1";
import { DataCoercion } from "@ganbarodigital/ts-lib-value-objects/V1";

const invalidUuid = Symbol("invalidUuid");

const mustBeUuid: DataCoercion<string> = (input: string, onError: OnError): string {
    // does `input` contain a well-formatted UUID?
    // if it doesn't, our onError handler has the opportunity to return
    // something that is correct
    if (!isUuidData(input)) {
        input = onError(invalidUuid, "input is not a well-formatted UUID", {input: input});
    }

    // if we get here, all is well
    return input;
};
```

We've added _data coercion_ for the sake of completeness. In our experience, we use _data guarantees_ practically everywhere.

## Value Objects

### What Is A Value Object?

A _value object_ is:

* an object
* with a type signature
* with a constructor that enforces a _data guarantee_
* that holds one (and only one!) value
* that is immutable
* that allows you to get the stored value

### How To Build Value Objects

This library currently supports two ways to build value objects:



### Advantages Of Value Objects

### Disadvantages Of Value Objects


## Type Refinements

### What Is A Type Refinement?

A _type refinement_ is:

*

### Type Branding

### Type Flavouring

### How To Declare A Type Refinement

### Advantages Of Type Refinement

* There's almost no runtime performance penalty.

    The TypeScript compiler removes the branding / flavouring from the final compiled JavaScript, leaving only the original type behind. For example, when your code runs, a branded string is just a string.

### Disadvantages Of Type Refinement

* No runtime type checking.

    Branded / flavoured types are just like interfaces and function types: they only exist within your TypeScript code. None of them exist in the compiled JavaScript. As a result, it's impossible to write any runtime checks that rely on type checking for your type refinements.

    Is it a problem in practice? It shouldn't be. It does take some getting used to, though.

## V1 API

### CoercedNumber

```typescript
/**
 * CoercedNumber is a base class for defining a subset of numbers.
 * The subset is defined by a contract / specification, and enforced
 * by a DataCoercion.
 *
 * The DataCoercion and OnError handler are passed into the base class's
 * constructor().
 *
 * DataCoercion gives you the option of transforming an invalid input into
 * one that is valid. For example, you could write a function that would
 * strip spaces or dashes from a credit card number.
 *
 * `EX` is the DataCoercion's onError EX type
 * `ER` is the return type from the DataCoercion's onError handler
 */
export class CoercedNumber<EX, ER extends number> extends CoercedPrimitive<number, EX, ER>;
```

Example:

```typescript

import { OnError } from "@ganbarodigital/ts-on-error/V1";
import { CoercedNumber, DataCoercion } from "@ganbarodigital/ts-lib-value-objects/V1";



```

## NPM Scripts

### npm run clean

Use `npm run clean` to delete all of the compiled code.

### npm run build

Use `npm run build` to compile the Typescript into plain Javascript. The compiled code is placed into the `lib/` folder.

`npm run build` does not compile the unit test code.

### npm run test

Use `npm run test` to compile and run the unit tests. The compiled code is placed into the `lib/` folder.

### npm run cover

Use `npm run cover` to compile the unit tests, run them, and see code coverage metrics.

Metrics are written to the terminal, and are also published as HTML into the `coverage/` folder.