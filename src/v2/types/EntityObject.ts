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
import { Entity } from "./Entity";

/**
 * Entity<ID, T> is the base class for defining your Entity hierarchies.
 *
 * Every Entity:
 *
 * - has an identity
 * - that you can access by an `id` property
 * - has a stored value
 * - that you can get the valueOf()
 *
 * Your child classes should implement readonly `get` accessors for
 * any fields of type `T` that you'd like to access without having
 * to call `valueOf()` all the time.
 */
export abstract class EntityObject<ID, T> implements Entity<ID, T> {
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
     * returns the ID of this entity
     */
    public abstract idOf(): ID;

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
     * a type-guard. It proves that an object is a wrapper around type `T`
     * that has ID `ID`.
     *
     * added mostly for completeness
     */
    public isEntity(): this is Entity<ID, T> {
        return true;
    }
}
