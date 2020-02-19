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
import { OnError } from "@ganbarodigital/ts-on-error/V1";
import { expect } from "chai";
import { describe } from "mocha";

import { Branded } from "./Branded";
import { makeRefinedTypeFactory, RefinedTypeFactory } from "./Factory";
import { Flavoured } from "./Flavoured";

type BrandedUuid = Branded<string, "uuid">;

function mustBeBrandedUuid(input: string): void {
    return;
}

function neverABrandedUuid(input: string, onError: OnError): never {
    throw onError(Symbol("neverABrandedUuid"), "never a branded UUID", {input});
}

type BrandedUuidFactory = RefinedTypeFactory<string, BrandedUuid, object>;

function defaultOnErrorHandler(reason: symbol, description: string, extra: object): never {
    throw new Error("DEFAULT ERROR HANDLER CALLED");
}

function brandedUuidIdentity(input: BrandedUuid): BrandedUuid {
    return input;
}

type FlavouredUuid = Flavoured<string, "uuid">;

function mustBeFlavouredUuid(input: string): void {
    return;
}

function neverAFlavouredUuid(input: string, onError: OnError): never {
    throw onError(Symbol("neverAFlavouredUuid"), "never a flavoured UUID", {input});
}

type FlavouredUuidFactory = RefinedTypeFactory<string, FlavouredUuid, object>;

function flavouredUuidIdentity(input: FlavouredUuid): FlavouredUuid {
    return input;
}

describe("v1 makeTypeRefinementFactory()", () => {
    it("returns a function", () => {
        const unit: BrandedUuidFactory = makeRefinedTypeFactory(
            mustBeBrandedUuid,
            defaultOnErrorHandler,
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
        const uuidFrom: BrandedUuidFactory = makeRefinedTypeFactory(
            mustBeBrandedUuid,
            defaultOnErrorHandler,
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
        const uuidFrom: FlavouredUuidFactory = makeRefinedTypeFactory(
            mustBeFlavouredUuid,
            defaultOnErrorHandler,
        );

        const inputValue = "123e4567-e89b-12d3-a456-426655440000";
        const actualValue = flavouredUuidIdentity(uuidFrom(inputValue));

        expect(inputValue).to.equal(actualValue);
    });

    it("creates a smart constructor that calls the default error handler when the guarantee fails", () => {
        const uuidFrom: BrandedUuidFactory = makeRefinedTypeFactory(
            neverABrandedUuid,
            defaultOnErrorHandler,
        );

        const inputValue = "123e4567-e89b-12d3-a456-426655440000";
        expect(() => {brandedUuidIdentity(uuidFrom(inputValue, defaultOnErrorHandler)); }).to.throw("DEFAULT ERROR HANDLER CALLED");
    });

    it("creates a smart constructor that accepts an optional error handler", () => {
        const localOnErrorHandler = (reason: symbol, description: string, extra: object): never => {
            throw new Error("LOCAL ERROR HANDLER CALLED");
        };

        const uuidFrom: BrandedUuidFactory = makeRefinedTypeFactory(
            neverABrandedUuid,
            localOnErrorHandler,
        );

        const inputValue = "123e4567-e89b-12d3-a456-426655440000";
        expect(() => {brandedUuidIdentity(uuidFrom(inputValue, localOnErrorHandler)); }).to.throw("LOCAL ERROR HANDLER CALLED");
    });
});