# UUID Parser for Typescript

## Introduction

This TypeScript library will take any [RFC 4122 UUID](http://www.ietf.org/rfc/rfc4122.txt), and parse it into a stream of bytes.

The library also offers a `Uuid` type, and a useful validation function.

## Quick Start

```
# run this from your Terminal
npm install @ganbarodigital/ts-uuid-parser
```

```typescript
// add this import to your Typescript code
import { Uuid } from "@ganbarodigital/ts-uuid-parser/V1"
```

__VS Code users:__ once you've added a single import anywhere in your project, you'll then be able to auto-import anything else that this library exports.

## V1 API

### Uuid()

```typescript
class Uuid {
    public readonly hex: string;

    constructor(uuid: string);
}
```

`Uuid` is a _type_. It represents a validated RFC 4122 UUID. The human-readable hex format is stored internally, and is available via the `.hex` property.

For example:

```typescript
import { Uuid } from "@ganbarodigital/ts-uuid-parser/V1";

// creates a new Uuid
const myUuid = new Uuid("9c47cb7c-9793-4944-9189-61a938d0e9bd");
```

### isUuidData()

```typescript
function isUuidData(input: Uuid|string): boolean
```

`isUuidData()` is a _data guard_. It returns `true` if the input is a UUID that this library can work with.

For example:

```typescript
import { isUuidData } from "@ganbarodigital/ts-uuid-parser/V1";

if (!isUuidData("12345-67890")) {
    throw new Error("invalid UUID");
}
```

### isUuidString()

```typescript
function isUuidString(input: string): boolean
```

`isUuidString()` is a _data guard_. It returns `true` if the input is a well-formatted UUID.

For example:

```typescript
import { isUuidString } from "@ganbarodigital/ts-uuid-parser/V1";

if (!isUuidString("12345-67890")) {
    throw new Error("UUID is not well-formatted; cannot use");
}
```

### isUuidType()

```typescript
function isUuidType(input: any): input is Uuid
```

`isUuidType()` is a _type guard_. Use it to prove to the TypeScript compiler that you're working with a `Uuid` type.

For example:

```typescript
import { Uuid, isUuid } from "@ganbarodigital/ts-uuid-parser/V1";

function shortenUuid(input: Uuid|string): string {
    if (isUuid(input)) {
        // at this point, the compiler knows that `input` is a Uuid
        let uuid = input;
    } else {
        // at this point, the compiler knows that `input` is a string
        let uuid = Uuid(input);
    }

    // ...
}
```

### mustBeUuid()

```typescript
function mustBeUuid(input: Uuid|string): void
```

`mustBeUuid()` is a _data guarantee_. It throws an `IllegalUuidError` if the input isn't an acceptable UUID.

For example:

```typescript
export class Uuid {
    public readonly hex: string;

    constructor(uuid: string) {
        mustBeUuid(uuid);
        this.hex = uuid;
    }
}
```

### uuidFromBytes()

```typescript
function uuidFromBytes(input: ArrayBuffer, offset = 0): Uuid
```

`uuidFromBytes()` is a _data transform_. It builds a human-readable UUID from a byte array.

### uuidToBytes()

```typescript
function uuidToBytes(uuid: Uuid|string, buf?: ArrayBuffer, offset = 0): ArrayBuffer

```

`uuidToBytes()` is a _data transform_. It builds a byte array from a human-readable UUID.

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