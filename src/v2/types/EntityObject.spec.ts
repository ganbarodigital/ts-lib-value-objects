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
import { expect } from "chai";
import { describe } from "mocha";

import { EntityObject } from "./EntityObject";

interface ExampleRecord {
    id: number;
    field1: string;
}

class ExampleEntity extends EntityObject<number, ExampleRecord> {
    public static from(input: ExampleRecord): ExampleEntity {
        return new ExampleEntity(input);
    }

    public idOf() {
        return this.value.id;
    }
}

describe("v2 Entity", () => {
    describe("constructor", () => {
        it("stores the input inside the Entity object", () => {
            const inputEntity: ExampleRecord = {
                id: 100,
                field1: "hello, unit test!",
            };
            const expectedEntity = inputEntity;

            const unit = ExampleEntity.from(inputEntity);
            const actualEntity = unit.valueOf();

            expect(actualEntity).to.equal(expectedEntity);
        });
    });

    describe(".valueOf()", () => {
        it("returns the Entity stored inside the Entity object", () => {
            const inputEntity: ExampleRecord = {
                id: 100,
                field1: "hello, unit test!",
            };
            const expectedEntity = inputEntity;

            const unit = ExampleEntity.from(inputEntity);
            const actualEntity = unit.valueOf();

            expect(actualEntity).to.equal(expectedEntity);
        });
    });

    describe(".idOf()", () => {
        it("returns the identity of the wrapped record", () => {
            const inputEntity: ExampleRecord = {
                id: 100,
                field1: "hello, unit test!",
            };
            const expectedValue = 100;

            const unit = ExampleEntity.from(inputEntity);
            const actualValue = unit.idOf();

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".isEntity()", () => {
        it("returns true", () => {
            const inputEntity: ExampleRecord = {
                id: 100,
                field1: "hello, unit test!",
            };
            const expectedValue = true;

            const unit = ExampleEntity.from(inputEntity);
            const actualValue = unit.isEntity();

            expect(actualValue).to.equal(expectedValue);
        });
    });
});