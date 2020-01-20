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

import { DataGuarantee } from "../types";

/**
 * RefinedType is a base class for defining a subset of any given type.
 * The subset is defined by a contract / specification, and enforced by
 * a DataGuarantee.
 *
 * If you are refining a `string` or a `number`, use `RefinedString` or
 * `RefinedNumber` instead. They contain additional methods to help
 * JavaScript auto-resolve to the wrapped primitive in some circumstances.
 *
 * `T` is the type to be wrapped.
 * `EX` is the type of error data passed to the OnError handler
 */
export class RefinedType<T, EX = object> {
    // this is the value that has been wrapped
    protected value: T;

    /**
     * define your own public constructor (or a static `from()` method if
     * you prefer that style, or want to support overloading)
     *
     * @param input
     *        this is the value that will be stored, if it passes the
     *        DataGuarantee
     * @param mustBe
     *        this is the function that enforces the contract / specification
     *        of this refined type
     *
     *        child classes normally decide what this will be. You don't
     *        normally allow the end-caller to pass this in.
     * @param onError
     *        the error handler that gets called if the DataGuarantee
     *        decides that the input doesn't meet the contract /
     *        specification
     *
     *        this is normally supplied by the end-caller.
     *
     *        child classes can make this optional, and provide a default
     *        error handler
     */
    protected constructor(
        input: T,
        mustBe: DataGuarantee<T, EX>,
        onError: OnError<EX, never>,
    ) {
        // enforce the contract
        mustBe(input, onError);

        // we're good to go
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
}