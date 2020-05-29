//
// Copyright (c) 2020-present Ganbaro Digital Ltd
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
//   * Re-distributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in
//     the documentation and/or other materials provided with the
//     distribution.
//
//   * Neither the names of the copyright holders nor the names of his
//     contributors may be used to endorse or promote products derived
//     from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
// ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
import { AnyAppError, OnError } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { expect } from "chai";
import { describe } from "mocha";

import { Branded, Flavoured, makeRefinedTypeFactoryWithFormatter, RefinedTypeFactory } from ".";
import { NeverABrandedUuidError } from "../fixtures";
import { NeverAFlavouredUuidError } from "../fixtures/NeverAFlavouredUuid";

function defaultErrorHandler(e: AnyAppError): never {
    throw new Error("DEFAULT ERROR HANDLER CALLED");
}

type BrandedUuid = Branded<string, "uuid">;

function mustBeBrandedUuid(input: string): void {
    return;
}

function neverABrandedUuid(input: string, onError: OnError): never {
    throw onError(new NeverABrandedUuidError());
}

type BrandedUuidFactory = RefinedTypeFactory<string, BrandedUuid>;

function brandedUuidIdentity(input: BrandedUuid): BrandedUuid {
    return input;
}

type FlavouredUuid = Flavoured<string, "uuid">;

function mustBeFlavouredUuid(input: string): void {
    return;
}

function neverAFlavouredUuid(input: string, onError: OnError): never {
    throw onError(new NeverAFlavouredUuidError());
}

type FlavouredUuidFactory = RefinedTypeFactory<string, FlavouredUuid>;

function flavouredUuidIdentity(input: FlavouredUuid): FlavouredUuid {
    return input;
}

describe("v2 makeTypeRefinementFactoryWithFormatter()", () => {
    it("returns a function", () => {
        const unit: BrandedUuidFactory = makeRefinedTypeFactoryWithFormatter(
            mustBeBrandedUuid,
            (x) => x,
        );

        expect(unit).to.be.instanceOf(Function);
    });

    it("creates a smart constructor for branded types", () => {
        // this is a weird one to test, because the refined type
        // does not exist at runtime
        //
        // the best we can do is to pass the refined type into
        // a function that expects the refined type
        //
        // if there is a defect, the test will fail to compile
        const uuidFrom: BrandedUuidFactory = makeRefinedTypeFactoryWithFormatter(
            mustBeBrandedUuid,
            (x) => x,
        );

        const inputValue = "123e4567-e89b-12d3-a456-426655440000";
        const actualValue = brandedUuidIdentity(uuidFrom(inputValue));

        expect(inputValue).to.equal(actualValue);
    });

    it("creates a smart constructor for flavoured types", () => {
        // this is a weird one to test, because the refined type
        // does not exist at runtime
        //
        // the best we can do is to pass the refined type into
        // a function that expects the refined type
        //
        // if there is a defect, the test will fail to compile
        const uuidFrom: FlavouredUuidFactory = makeRefinedTypeFactoryWithFormatter(
            mustBeFlavouredUuid,
            (x) => x,
        );

        const inputValue = "123e4567-e89b-12d3-a456-426655440000";
        const actualValue = flavouredUuidIdentity(uuidFrom(inputValue));

        expect(inputValue).to.equal(actualValue);
    });

    it("creates a smart constructor that calls the provided formatter", () => {
        const uuidFrom = makeRefinedTypeFactoryWithFormatter(
            mustBeBrandedUuid,
            (x) => x.toLocaleLowerCase(),
        );

        const inputValue = "123E4567-E89B-12D3-A456-426655440000";
        const expectedValue = "123e4567-e89b-12d3-a456-426655440000";

        const actualValue = uuidFrom(inputValue);

        expect(actualValue).to.equal(expectedValue);
    });

    // tslint:disable-next-line: max-line-length
    it("creates a smart constructor for branded types that calls the default error handler when the guarantee fails", () => {
        const uuidFrom: BrandedUuidFactory = makeRefinedTypeFactoryWithFormatter(
            neverABrandedUuid,
            (x) => x,
            defaultErrorHandler,
        );

        const inputValue = "123e4567-e89b-12d3-a456-426655440000";
        expect(() => {brandedUuidIdentity(uuidFrom(inputValue)); }).to.throw("DEFAULT ERROR HANDLER CALLED");
    });

    // tslint:disable-next-line: max-line-length
    it("creates a smart constructor for flavoured types that calls the default error handler when the guarantee fails", () => {
        const uuidFrom: BrandedUuidFactory = makeRefinedTypeFactoryWithFormatter(
            neverAFlavouredUuid,
            (x) => x,
            defaultErrorHandler,
        );

        const inputValue = "123e4567-e89b-12d3-a456-426655440000";
        expect(() => {brandedUuidIdentity(uuidFrom(inputValue)); }).to.throw("DEFAULT ERROR HANDLER CALLED");
    });

    it("creates a smart constructor that accepts an optional error handler", () => {
        const localOnErrorHandler = (e: AnyAppError): never => {
            throw new Error("LOCAL ERROR HANDLER CALLED");
        };

        const uuidFrom: BrandedUuidFactory = makeRefinedTypeFactoryWithFormatter(
            neverABrandedUuid,
            (x) => x,
            defaultErrorHandler,
        );

        const inputValue = "123e4567-e89b-12d3-a456-426655440000";
        expect(() => {brandedUuidIdentity(uuidFrom(inputValue, localOnErrorHandler)); }).to.throw("LOCAL ERROR HANDLER CALLED");
    });
});