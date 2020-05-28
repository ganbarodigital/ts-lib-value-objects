# Value Objects for Typescript

![Node.js CI](https://github.com/ganbarodigital/ts-lib-value-objects/workflows/Node.js%20CI/badge.svg)

## Introduction

This TypeScript library will help you create _value objects_ and _refined types_. They will help you write safer software that also performs better.

**NOTE: This README documents the `v2` API. The older `V1` API has been dropped.**

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [General Concepts](#general-concepts)
  - [An Example: UUIDs](#an-example-uuids)
- [Which Approach Is Best?](#which-approach-is-best)
- [Foundation Types](#foundation-types)
  - [Type Guard](#type-guard)
  - [Data Guard](#data-guard)
  - [Data Guarantee](#data-guarantee)
  - [Data Coercion](#data-coercion)
- [Value Objects](#value-objects)
  - [What Is A Value Object?](#what-is-a-value-object)
  - [How To Build Value Objects](#how-to-build-value-objects)
  - [ValueObject.isValue()](#valueobjectisvalue)
  - [ValueObject.valueOf()](#valueobjectvalueof)
  - [Advantages Of Value Objects](#advantages-of-value-objects)
  - [Disadvantages Of Value Objects](#disadvantages-of-value-objects)
- [Entities and EntityObjects](#entities-and-entityobjects)
  - [What Is An Entity?](#what-is-an-entity)
  - [How Does An Entity Differ From A Value?](#how-does-an-entity-differ-from-a-value)
  - [How To Build Entities](#how-to-build-entities)
- [Refined Types](#refined-types)
  - [What Is A Refined Type?](#what-is-a-refined-type)
  - [What Is Type Refinement?](#what-is-type-refinement)
  - [How To Build A Refined Type](#how-to-build-a-refined-type)
  - [Type Branding](#type-branding)
  - [Type Flavouring](#type-flavouring)
  - [Gotchas For Branded Types And Flavoured Types](#gotchas-for-branded-types-and-flavoured-types)
  - [makeRefinedTypeFactory()](#makerefinedtypefactory)
  - [Advantages Of Refined Types](#advantages-of-refined-types)
  - [Disadvantages Of Refined Types](#disadvantages-of-refined-types)
- [Refined Types As Value Objects](#refined-types-as-value-objects)
  - [RefinedString and RefinedNumber Classes](#refinedstring-and-refinednumber-classes)
- [Converting From `V1` API To `v2` API](#converting-from-v1-api-to-v2-api)
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
import { RefinedString } from "@ganbarodigital/ts-lib-value-objects/lib/v2"
```

__VS Code users:__ once you've added a single import anywhere in your project, you'll then be able to auto-import anything else that this library exports.

## General Concepts

The basic idea behind _value objects_ and _refined types_ is to use TypeScript's type system to reduce the amount of runtime checks we need (improve _robustness_) **and** reduce the amount of logic defects in our code (improve _correctness_).

How do we do this?

* We define new types that can only contain valid values.
* We take all of the `isXXX()` kind of checks that are scattered around our code, and put them into _smart constructors_ for these new types.
* That way, the checks run once (when we create the value), and don't have to run again when we pass the value into functions and methods (because the TypeScript compiler prevents us passing the wrong type / returning the wrong type).
* Our functions and methods can then be made simplier, because they know they're receiving a value that is always valid. In many cases, functions and methods can be made to work 100% of the time.

Or, to put it another way, we consolidate most of our defensive programming checks into _smart constructors_, and we write our business logic to always work for our new types.

**None of this removes the need to write good unit tests.** You'll end up writing less code, with less complexity. This will reduce the number of branches in your code. Less branches means less test cases to cover with your unit tests. You still need to write unit tests for every branch of code that remains.

### An Example: UUIDs

For example, a universally-unique ID (or UUID for short) is a string that contains a mixture of hexadecimal values and some '-' separator characters. The string must be 36 characters long, and the separators must be in specific places in the string. And there's some rules about the values of some of the hexadecimal characters too.

We can say that "all UUIDs are strings", but we cannot say that "all strings are UUIDs". What do we mean?

* We can use a UUID's value as a parameter to any function or method that expects a `string`, and that function / method will work as expected.
* But if we pass any old string into a function / method that expects a UUID, the function / method probably won't work as expected.

In pure JavaScript (and many other languages!), each function / method would have to call an `isUUID(input)` function first, just to protect itself from a bad input. This is a _robustness check_, and an example of _defensive programming_. You may have also heard it called _programming by contract_.

Each call to `isUUID()` is a _runtime check_: it happens every time the function / method calls. There's a performance cost to runtime checks, and that cost adds up very quickly.

We want to use TypeScript to replace these runtime checks with _compile-time checks_ instead. And there's two ways to do that:

* we can build a `Uuid` class, and create _value objects_, or
* we can create a `Uuid` "branded" string, known as a _refined type_

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

// uuid2 is a refined type
// it's actually a 'branded' string, and not an object
// but, at compile time, TypeScript treats it as a unique type
const uuid2 = uuidFrom("123e4567-e89b-12d3-a456-426655440000");

// this works
doSomething(uuid2);

// this produces a TypeScript compile error
doSomething("123e4567-e89b-12d3-a456-426655440000");
```

Each approach has pros and cons, and we'll cover those below.

## Which Approach Is Best?

Use _value objects_ when:

* you are mixing TypeScript and JavaScript in the same code base
* if you want to keep everything as simple as possible
* you are wrapping objects / interfaces

Use _refined types_ when:

* your app is written entirely in TypeScript
* you're comfortable dealing with a mix of value objects and refined types
* you're comfortable with the [gotchas of refined types](#gotchas-for-branded-types-and-flavoured-types)

Note that _refined types_ only work for strings and numbers. For everything else, you have to use _value objects_ anyway.

## Foundation Types

Both _value objects_ and _refined types_ rely on a group of underlying, foundational types. We use these types to describe the functions that our _smart constructors_ call.

### Type Guard

```typescript
/**
 * A TypeGuard inspects a piece of data to see if the data is the given
 * type.
 *
 * If the given data is the given type, the function returns `true`.
 * It returns `false` otherwise.
 *
 * TypeGuards are a form of runtime robustness check. They're used to
 * make sure that the given input is the type you think it is, before you
 * try and use that input. They help prevent runtime errors.
 */
export type TypeGuard<T> = (input: unknown) => input is T;
```

A _type guard_ is a function that tells the TypeScript compiler to treat a value as a given type.

```typescript
import { TypeGuard } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

const isUuidType: TypeGuard<Uuid> = (input: unknown): input is Uuid => {
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

* we recommend ending your type guards with the word `Type`, to tell them apart from _data guards_. For example, `isUuidType()` instead of `isUuid()`. That creates space for a `isUuidData()` function later on.

We've added the `TypeGuard` type for completeness. It's handy if you're passing a type guard as a parameter into another function / method.

### Data Guard

```typescript
/**
 * A DataGuard inspects a piece of data to see if the data meets a
 * given contract / specification.
 *
 * If the given data does meet the contract, the function returns `true`.
 * It returns `false` otherwise.
 *
 * DataGuards work best when they check for one thing, for something that
 * can't meaningfully be broken down into multiple things.
 *
 * That makes them very reusable, and it allows you to build up rich
 * error reporting in your code.
 *
 * `T` is the type of data to be inspected.
 */
export type DataGuard<T> = (input: T) => boolean;
```

A _data guard_ is a function. It inspects the given data, and returns `true` if the data matches its internal rule(s). It returns `false` otherwise.

Data guards are an example of a _contract_ or _specification_, depending on what programming paradigm you subscribe to :)

```typescript
import { DataGuard } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

const UuidRegex = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$", "i");

const isUuidData: DataGuard<string> = (input: string): boolean => {
    return UuidRegex.test(input);
}
```

Notes:

* keep your data guards as short as possible, so that they're as reusable as possible
* ideally, each data guard should check just one thing. You can build stricter data guards by composing multiple, smaller, guards together.

### Data Guarantee

```typescript
/**
 * A DataGuarantee inspects the given data, to see if the given data
 * meets a defined contract / specification.
 *
 * If the given data does meet the given contract / specification, the
 * DataGuarantee returns the given data.
 *
 * If the given data does not meet the given contract / specification,
 * the DataGuarantee calls the supplied OnError handler. The OnError
 * handler must throw an Error of some kind.
 *
 * `T` is the type of data to be inspected
 *
 * When you implement a DataGuarantee, make it a wrapper around one or more
 * TypeGuards and/or DataGuards - and even other DataGuarantees if
 * appropriate. That's the best way to make your code as reusable as possible.
 */
export type DataGuarantee<T>
  = (input: T, onError: OnError) => void;
```

A _data guarantee_ is a function. It enforces a _contract_ or _specification_. It calls one or more _data guards_ to inspect the given input, and if the input doesn't meet the contract / specification, it calls the supplied `OnError` handler.

The `OnError` handler decides which `Error` to throw. If it is called, the `OnError` handler _always_ throws an `Error` of some kind.

```typescript
import { OnError } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { DataGuarantee } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

const invalidUuid = Symbol("invalidUuid");

const mustBeUuidData: DataGuarantee<string> = (input: string, onError: OnError): void => {
    // does the string contain a well-formatted UUID?
    if (!isUuidData(input)) {
        onError(new InvalidUuidError({public: {input}}));
    }

    // if we get here, all is well
}
```

There's a lot going on here. Let's break it down:

* `mustBeUuidData()` is a _data guarantee_. It takes an input string to inspect, and an `onError` handler to call if the inspection fails.
* It reuses the existing _data guard_ `isUuidData()`. It doesn't define its own checks.
* If the `isUuidData()` check fails, `mustBeUuidData()` doesn't have its own hard-coded error that it throws. Instead, it calls the `OnError` handler (that you provide), so that you can decide what to do and what error to throw.

Data guarantees get used in so-called _smart constructors_:

```typescript
import { OnError } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { ValueObject } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

// this is the value object approach
class Uuid extends ValueObject {
    // `from()` is our smart constructor
    public static from(input: string, onError?: OnError): Uuid {
        // make sure we have an error handler
        onError = onError ?? defaultUuidErrorHandler;

        // enforce the data guarantee
        mustBeUuidData(input, onError);

        // we tell our parent class' constructor which
        // data guarantee and error handler to use, and
        // it takes care of all the necessary calls
        return new Uuid(input);
    }
}

// call the 'smart constructor' to create the value
// `uuid` is an object, and an instanceof Uuid
let uuid = Uuid.from("123e4567-e89b-12d3-a456-426655440000");
```

```typescript
import { OnError } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { Branded, makeRefinedTypeFactory } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

// this is an example of "type refinement", using a "branded" string
type Uuid = Branded<string, "uuid">;

// TypeScript can't infer this type
// so we have to define it manually
type UuidBuilder = (input: string, onError?: OnError) => Uuid;

// uuidFrom() is a 'smart constructor'
const uuidFrom: UuidBuilder = makeRefinedTypeFactory(
    mustBeUuidData,
    defaultUuidErrorHandler,
);

// call the 'smart constructor' to create the value
//
// `uuid` is a string in plain Javascript
// TypeScript sees it as an Intersection type
let uuid = uuidFrom("123e4567-e89b-12d3-a456-426655440000");
```

### Data Coercion

```typescript
/**
 * A DataCoercion inspects the given data, to see if the given data
 * meets a defined contract / specification.
 *
 * If the given data does meet the given contract / specification, the
 * DataCoercion returns the given data.
 *
 * If the given data does not meet the given contract / specification,
 * the DataCoercion calls the supplied OnError handler. The OnError
 * handler can do any of the following:
 *
 * a) it can throw an Error (ie it never returns), or
 * b) it can return a value that does meet the given contract / specification
 *
 * `T` is the type of data to be inspected
 * `GR` is the return type of the data guarantee function
 * - it *must* be compatible with `T` in some way
 * - `GR` is also the return type of the supplied `OnError` handler
 *
 * When you implement a DataCoercion, make it a wrapper around one or more
 * TypeGuards and/or DataGuards - and even other DataCoercions if
 * appropriate. That's the best way to make your code as reusable as possible.
 */
export type DataCoercion<T, GR extends T = T>
  = (input: T, onError: OnError<AnyAppError, GR>) => GR;
```

A _data coercion_ is a function. It enforces a _contract_ or _specification_. It inspects the given input, and if the input doesn't meet the contract / specification, it calls the supplied `OnError` handler. (So far, that's exactly the same as a _data guarantee_.)

The `OnError` handler can do one of two things:

- it can return a value that does meet the contract / specification (this is new!), or
- it can throw an `Error` of some kind (just like an `OnError` handler for a _data guarantee_)

```typescript
import { AnyAppError, OnError } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { DataCoercion } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

const mustBeUuidData: DataCoercion<string> = (input: string, onError: OnError<AnyAppError, string|never>): string => {
    // does `input` contain a well-formatted UUID?
    // if it doesn't, our onError handler has the opportunity to return
    // something that is correct
    if (!isUuidData(input)) {
        input = onError(new InvalidUuidError({public: {input}});
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
* with a _smart constructor_ (one that enforces a _data guarantee_)
* that holds one (and only one!) value
* that is immutable
* that allows you to get the stored value

```typescript
/**
 * Value<T> describes the behaviour of data that does have a value,
 * but does not have an identity (a primary key).
 *
 * It is useful for ensuring all value objects have a *minimal* set
 * of common behaviour, whether or not they share a common base class.
 *
 * Use Entity<ID,T> for data that does have an identity.
 */
export interface Value<T> {
    /**
     * a type-guard.
     *
     * added mostly for completeness
     */
    isValue(): this is Value<T>;

    /**
     * returns the wrapped value
     *
     * for types passed by reference, we do NOT return a clone of any kind.
     * You have to be careful not to accidentally change this value.
     */
    valueOf(): T;
}

/**
 * ValueObject<T> is the base class for defining your Value Object
 * hierarchies.
 *
 * Every Value Object:
 *
 * - has a stored value
 * - that you can get the valueOf()
 *
 * We've deliberately kept this as minimal as possible. We're looking to
 * support idiomatic TypeScript code, rather than functional programming.
 *
 * If you do want fully-functional programming, use one of the many
 * excellent libraries that are out there instead.
 *
 * Use EntityObject<ID,T> for data that has an identity (a primary key).
 */
export class ValueObject<T> implements Value<T> {
    /**
     * this is the data that we wrap
     *
     * child classes are welcome to access it directly (to avoid the cost
     * of a call to `valueOf()`), but should never modify the data at all
     */
    protected readonly value: T;

    /**
     * this constructor does no contract / specification enforcement at all
     * do that in your constructor, before calling super()
     *
     * if you don't need to enforce a contract, your class can safely
     * create a public constructor
     */
    protected constructor(input: T) {
        this.value = input;
    }

    /**
     * returns the wrapped value
     *
     * for types passed by reference, we do NOT return a clone of any kind.
     * You have to be careful not to accidentally change this value.
     */
    public valueOf(): T {
        return this.value;
    }

    /**
     * a type-guard. It proves that an object is a wrapper around type `T`.
     *
     * added mostly for completeness
     */
    public isValue(): this is Value<T> {
        return true;
    }
}
```

### How To Build Value Objects

Define one (or more!) _data guards_:

```typescript
const UuidRegex = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$", "i");

export function isUuidData(input: string): boolean {
    return UuidRegex.test(input);
}
```

Define a _data guarantee_ that uses your _data guard(s)_:

```typescript
import { OnError } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

export function mustBeUuidData(input: string, onError: OnError): void {
    if (isUuidData(input)) {
        return true;
    }

    return onError(new InvalidUuidError({public: { input}});
}
```

Define a class that:

* extends `ValueObject`, and
* has a _smart constructor_

```typescript
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { ValueObject } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

class Uuid extends ValueObject<string> {
    public static from(input: string, onError: OnError = THROW_THE_ERROR): Uuid {
        // enforce the contract / specification!
        mustBeUuidData(input, onError);

        // if we get here, we *know* that `input` is safe to store
        return new Uuid(input);
    }
}
```

At this point, you can create new Uuid value objects:

```typescript
// call the 'smart constructor' to create the value
// `uuid` is an object, and an instanceof Uuid
let uuid = Uuid.from("123e4567-e89b-12d3-a456-426655440000");
```

... and you can use the `Uuid` type safely in any of your functions:

```typescript
function uuidToBytes(uuid: Uuid): Buffer {
    // convert a well-formatted UUID into binary data
    return Buffer.from(uuid.valueOf().split("-").join(), "hex");
}
```

### ValueObject.isValue()

Every value object comes with a `isValue()` method:

```typescript
class ValueObject {
    /**
     * a type-guard.
     *
     * added mostly for completeness
     */
    isValue(): this is Value<T>;
}
```

Honestly, I can't think of an example of where you'd need to call it. It's there if you ever need it!

### ValueObject.valueOf()

Every value object comes with a `valueOf()` method:

```typescript
class ValueObject {
    /**
     * returns the wrapped value
     *
     * for types passed by reference, we do NOT return a clone of any kind.
     * You have to be careful not to accidentally change this value.
     */
    valueOf(): T;
}
```

Use `valueOf()` to get access to the wrapped type:

```typescript
function uuidToBytes(uuid: Uuid): Buffer {
    // convert a well-formatted UUID into binary data
    return Buffer.from(uuid.valueOf().split("-").join(), "hex");
}
```

Notes:

* The value returned by `valueOf()` may not be immutable. That's out of our control. So be careful how you use it. In particular, avoid `+=`, `-=` type operators.

### Advantages Of Value Objects

In no particular order ...

* Value objects have type information at runtime. You can use the Javascript `instanceof` operator in your type-guards to be sure that you're working with the type of object that you expect.
* Value objects can be extended, to add further behaviours via additional methods (if you prefer an OOP-style of programming).
* Value objects are safer if your code-base is a mixture of TypeScript and Javascript (e.g., you're gradually converting an older Javascript project over to TypeScript).

### Disadvantages Of Value Objects

In no particular order ...

* Value objects perform worse than refined types.
* Value objects take up more RAM at runtime than refined types.
* TypeScript v3.7.x (the latest at the time of writing) doesn't correctly support JavaScript's object-to-primitive auto-conversion mechanisms. If you're wrapping a `number`, you might prefer doing that as a _refined type_.

## Entities and EntityObjects

### What Is An Entity?

An _entity_ is a value that has some form of identity. For example, database records that have primary keys are _entities_.

```typescript
/**
 * Entity<ID, T> describes the behaviour of data that has an identity.
 *
 * It is useful for ensuring all entities have a *minimal* set
 * of common behaviour, whether or not they share a common base class.
 */
export interface Entity<ID, T> {
    /**
     * this entity's identity.
     *
     * this is normally one (or more) fields from `T`.
     */
    idOf(): ID;

    /**
     * a type-guard. It proves that an object is a wrapper around type `T`
     * that has ID `ID`.
     *
     * added mostly for completeness
     */
    isEntity(): this is Entity<ID, T>;

    /**
     * returns the wrapped value
     *
     * for types passed by reference, we do NOT return a clone of any kind.
     * You have to be careful not to accidentally change this value.
     */
    valueOf(): T;
}
```

### How Does An Entity Differ From A Value?

They're very similar, in practice.

* Both are wrappers around a value.
* Both provide _smart constructors_ to make sure that they don't contain illegal values.
* Both implement `valueOf()` to get at that wrapped value.
* Both can implement individual `get` accessors to provide access to individual parts of the wrapped value.
* They share the same advantages and disadvantages compared to _refined types_.

The main difference is that an `Entity` provides a readonly property called `__id__` too. `__id__` will always be the identity of the `Entity`. For example, in a database record, `__id__` will always return the primary key.

### How To Build Entities

The process is almost the same as [building a value object](#how-to-build-value-objects).

* Define one (or more) _data guards_.
* Define a _data guarantee_ that uses your _data guard(s)_.
* Define an interface (which we'll call `T`) to represent whatever record will be stored in the Entity object.
* Define a type (or re-use an existing type) to represent the identity of your entity.
* Define a class that:
  - extends `EntityObject`,
  - has a _smart constructor_,
  - has a `idOf()` function,
  - (maybe) has _get accessors_ for the individual members of your type `T`

```typescript
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { EntityObject } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

class ExampleEntity extends EntityObject<ID, T> {
    public static from(input, T: onError: OnError = THROW_THE_ERROR): ExampleEntity {
        // call your smart constructor here
        mustBeExample(input, onError);

        return new ExampleEntity(input);
    }

    public idOf(): ID {
        // replace `primaryKey` with whatever field(s) form the identity
        // of your entity
        return input.primaryKey;
    }
}
```

## Refined Types

### What Is A Refined Type?

A _refined type_ is:

* a primitive type
* with a well-defined subset of valid values
* with a _smart constructor_ (one that enforces a _data guarantee_)

We use _refined types_ where we want to restrict (say) the range of numbers that a function can accept.

**The _refined type_ only exists inside the TypeScript compiler**. At runtime, the Javascript interpreter only sees the underlying primitive type. Think of them as being like TypeScript interfaces, not Javascript classes.

### What Is Type Refinement?

We say that _type refinement_ is the process of turning a more generic type into a stricter type.

For example, all UUIDs are strings, but not all strings are valid UUIDs. In this case, _type refinement_ would be where we take a `string` type as input, and return a `Uuid` type as output.

_Type refinement_ is always done by the _smart constructor_.

### How To Build A Refined Type

In TypeScript, there are two different ways to create a _refined type_.

* _Type branding_ is a little stricter: they can only be created using _smart constructors_
* _Type flavouring_ is a little looser: you can cast primitives to the _refined type_ without having to call a _smart constructor_

As a rule of thumb, _type branding_ is safer, but sometimes _type flavouring_ can be more convenient.

### Type Branding

Define one (or more!) _data guards_:

```typescript
const UuidRegex = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$", "i");

export function isUuidData(input: string): boolean {
    return UuidRegex.test(input);
}
```

Define a _data guarantee_:

```typescript
import { OnError } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

export function mustBeUuidData(input: string, onError: OnError): void {
    if (isUuidData(input)) {
        return true;
    }

    return onError(new InvalidUuidError({public: { input }}));
}
```

Define a _default onError handler_:

```typescript
export function throwInvalidUuidError(e: AnyAppError): never {
    throw e;
}
```

Define a _branded type_ and _smart constructor_:

```typescript
import { OnError } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import {
    Branded,
    RefinedTypeFactory,
    makeRefinedTypeFactory,
} from "@ganbarodigital/ts-lib-value-objects/lib/v2";

// this is our branded type
type Uuid = Branded<string, "uuid">;

// we need to give the TypeScript compiler a bit of help
//
// as of v3.7, it cannot work out by itself that our
// `uuidFrom()` function below returns a `Uuid`
type UuidFactory = RefinedTypeFactory<string, Uuid>;

// this is our smart constructor
const uuidFrom: UuidFactory = makeRefinedTypeFactory<string, Uuid>(
    mustBeUuidData, throwInvalidUuidError
)
```

At this point, you can create new UUID values:

```typescript
// call the 'smart constructor' to create the value
// `uuid` is a string at runtime, and a `Uuid` interface at compile-time
let uuid = uuidFrom("123e4567-e89b-12d3-a456-426655440000");
```

... and you can use the `Uuid` type safely in any of your functions:

```typescript
function uuidToBytes(uuid: Uuid): Buffer {
    // convert a well-formatted UUID into binary data
    //
    // NOTE that we do not need to call `valueOf()` here
    return Buffer.from(uuid.split("-").join(), "hex");
}
```

### Type Flavouring

(_Type flavouring_ is a technique first documented by [Atomic Object](https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/).)

There's only one difference between _flavoured types_ and _branded types_: you can assign a compatible primitive to a _flavoured type_.

```typescript
import { Flavoured } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

type Uuid = Flavoured<string, "uuid">;

// here, we tell TypeScript to treat this string
// as a `Uuid` type
const uuid: Uuid = "123e4567-e89b-12d3-a456-426655440000";
```

_Flavoured types_ are more convenient when loading data from a database.

### Gotchas For Branded Types And Flavoured Types

_Branded types_ and _flavoured types_ don't give you the same level of type safety as _value objects_, even at compile time.

Unfortunately, **TypeScript won't tell you if you mix these types in an operation:**

```typescript
import { Branded } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

type Inches = Branded<number, "inches">;
type Centimetres = Branded<number, "centimetres">;

const a = 9 as Inches;
const b = 10 as Centimetres;

// this should not compile ... but it does
const c = a + b;
```

To use _branded types_ and _flavoured types_ safely, make sure that you wrap any operations in a function:

```typescript
import { Branded } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

type Inches = Branded<number, "inches">;
type Centimetres = Branded<number, "centimetres">;

function sum(a: Inches, b: Centimetres): Centimetres {
    return ((a * 2.54) + b) as Centimetres;
}

const a = 9 as Inches;
const b = 10 as Centimetres;

// this will compile
const c = sum(a, b);

// this will not compile, because the parameters
// are the wrong way around
const c = sum(b, a);
```

### makeRefinedTypeFactory()

`makeRefinedTypeFactory()` builds your _smart constructor_ for you.

```typescript
export type RefinedTypeFactory<BI, BR> = (input: BI, onError?: OnError) => BR;

/**
 * makeRefinedTypeFactory creates factories for your branded and
 * flavoured types.
 *
 * You tell it:
 *
 * - what input type your factory should accept
 * - the DataGuarantee to enforce
 * - the default error handler to call if the DataGuarantee fails
 * - what output type your factory should return
 *
 * and it will return a type-safe function that you can re-use to validate
 * and create your branded and flavoured types.
 *
 * `BI` is the input type that your factory accepts (e.g. `string`)
 * `BR` is the type that your factory returns
 *
 * @param mustBe
 *        this will be called every time you use the function that we return.
 *        Make sure that it has no side-effects whatsoever.
 * @param defaultOnError
 *        the function that we return has an optional `onError` parameter.
 *        If the caller doesn't provide an `onError` parameter, the function
 *        will call this error handler instead.
 */
export const makeRefinedTypeFactory = <BI, BR>(
    mustBe: DataGuarantee<BI>,
    defaultOnError: OnError,
): RefinedTypeFactory<BI, BR>
```

You pass in your _data guarantee_ and a default `OnError` handler, and `makeRefinedTypeFactory()` returns a function that you can use as a _smart constructor_.

See the [Type Branding](#type-branding) example code above to see it in action.

### Advantages Of Refined Types

* There's almost no runtime performance penalty.

    The TypeScript compiler removes the branding / flavouring from the final compiled JavaScript, leaving only the original type behind. For example, when your code runs, a branded string is just a string. But you're only having to do those checks once per value (in the smart constructor) instead of inside every function / method as part of your _defensive programming_.

    The only runtime performance cost is the data checking work done inside the smart constructor. That can still add up, if you're processing hundreds or thousands of pieces of data in a single operation / API handler.

### Disadvantages Of Refined Types

* The TypeScript compiler doesn't catch operations that use mixed types (see [gotchas](#gotchas-for-branded-types-and-flavoured-types) above). It only catches assignments involving mixed types.

    **This is a big disadvantage.** It puts the effort of type checking back onto the programmer. You can mitigate it with a disciplined approach (wrap all operations in their own functions), but beware: any approach that requires the developer to do the right thing 100% of the time always leads to bugs being shipped to production. Even experienced developers will make mistakes.

* No runtime type checking.

    Branded / flavoured types are just like interfaces and function types: they only exist within your TypeScript code. None of them exist in the compiled JavaScript. As a result, it's impossible to write any runtime checks that rely on type checking for your refined types.

    Is it a problem in practice? It shouldn't be. It does take some getting used to, though.

## Refined Types As Value Objects

If you want to create refined types that are still full-blown [value objects](#value-objects), we've got support for that too.

### RefinedString and RefinedNumber Classes

`RefinedString` and `RefinedNumber` are two classes we export for you. They're identical, except that one is for wrapping a `string`, and the other is for wrapping a `number`.

Both classes extend the [ValueObject](#value-objects) class documented earlier. They also add some additional methods to help Javascript auto-convert to a primitive in some circumstances (for example, writing to the `console.log()`).

Here's an example of how to create a `Uuid` value object type, using the `RefinedString` class.

```typescript
import { RefinedString } from "@ganbarodigital/ts-lib-value-objects/lib/v2";
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-error-reporting/lib/v1";

const UuidRegex = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$", "i");

// it is good practice to define a standalone data guard
export function isUuidData(input: string): boolean {
    return UuidRegex.test(input);
}

// it is good practice to define a standalone data guarantee
export function mustBeUuid(input: string, onError: OnError): void {
    if (isUuidData(input)) {
        return true;
    }

    return onError(new InvalidUuidError({ public: { input } }));
}

class Uuid extends RefinedString {
    public static from(input: string, onError?: OnError = THROW_THE_ERROR): Uuid {
        // the parent constructor will handle everything for us
        super(input, mustBeUuid, onError);
    }
}
```

Notes:

* At the time of writing (TypeScript v3.7.x), TypeScript doesn't understand / support auto-conversion of objects to numbers, even though it is valid JavaScript. See [TypeScript issue 2031](https://github.com/microsoft/TypeScript/issues/2031) for where the bug was introduced, [TypeScript issue 4538](https://github.com/microsoft/TypeScript/issues/4538) for the main bug report, and [TypeScript issue 2361](https://github.com/microsoft/TypeScript/issues/2361) for where (we hope) work on the fix is being tracked.

    Until this TypeScript bug is fixed, you're probably better off using a [refined type](#refined-types) for numbers, instead of value objects.

## Converting From `V1` API To `v2` API

Got existing code that uses the `V1` API? Here's the steps that you need to take, to switch over to the `v2` API:

* Search/replace `ts-lib-value-objects/V1` to be `ts-lib-value-objects/lib/v2`
* Any value objects must now implement the `Value` interface. It was called `ValueObject` in the `V1` API.
* Any value objects must now extend the `ValueObject` base class. It was called `Value` in the `v1` API.
* Switch your error handlers to use `@ganbarodigital/ts-lib-error-reporting`.

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