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

import { DataCoercion, DataGuarantee } from "../types";
import { AnyBranded } from "./Branded";
import { AnyFlavoured } from "./Flavoured";

/**
 * This is a type that matches:
 *
 * - all `Branded` types, AND
 * - all `Flavoured` types too
 *
 * We use this as a type-constraint for our factory builders.
 *
 * You can safely use this in your own code.
 */
export type AnySafePrimitiveType = AnyBranded | AnyFlavoured;

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
 * `BR` is the type that your factory returns. This must be a `Branded`
 *      type of some kind, or a `Flavoured` type of some kind
 * `EX` is the `EX` generic type for the default OnError handler
 *
 * @param mustBe
 *        this will be called every time you use the function that we return.
 *        Make sure that it has no side-effects whatsoever.
 * @param defaultOnError
 *        the function that we return has an optional `onError` parameter.
 *        If the caller doesn't provide an `onError` parameter, the function
 *        will call this error handler instead.
 */
export function makeRefinedTypeFactory<BI, BR extends AnySafePrimitiveType, EX>(
    mustBe: DataGuarantee<BI, EX>,
    defaultOnError: OnError<EX, never>,
): (input: BI, onError?: OnError<EX, never>) => BR {
    return (input: BI, onError?: OnError<EX>): BR => {
        // make sure we have a way to tell the caller if something
        // goes wrong!
        onError = onError ?? defaultOnError;

        // enforce the contract
        mustBe(input, onError);

        // we're good at this point
        return (input as unknown) as BR;
    };
}

/**
 * makeCoercedTypeFactory creates factories for your branded and
 * flavoured types.
 *
 * You tell it:
 *
 * - what input type your factory should accept
 * - the DataCoercion to use
 * - the default error handler to call if the DataGuarantee fails
 * - what output type your factory should return
 *
 * and it will return a type-safe function that you can re-use to validate
 * and create your branded and flavoured types.
 *
 * `BI` is the input type that your factory accepts (e.g. `string`)
 * `BR` is the type that your factory returns. This must be a `Branded`
 *      type of some kind, or a `Flavoured` type of some kind
 * `EX` is the `EX` generic type for the default OnError handler
 *
 * @param mustBe
 *        this will be called every time you use the function that we return.
 *        Make sure that it has no side-effects whatsoever.
 * @param defaultOnError
 *        the function that we return has an optional `onError` parameter.
 *        If the caller doesn't provide an `onError` parameter, the function
 *        will call this error handler instead.
 */
export function makeCoercedTypeFactory<BI, BR extends AnySafePrimitiveType, EX>(
    mustBe: DataCoercion<BI, BI, EX>,
    defaultOnError: OnError<EX, BI>,
): (input: BI, onError?: OnError<EX, BI>) => BR {
    return (input: BI, onError?: OnError<EX, BI>): BR => {
        // make sure we have a way to tell the caller if something
        // goes wrong!
        onError = onError ?? defaultOnError;

        // enforce the contract
        input = mustBe(input, onError);

        // we're good at this point
        return (input as unknown) as BR;
    };
}