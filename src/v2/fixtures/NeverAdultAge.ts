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
import {
    AppError,
    AppErrorParams,
    ErrorTableTemplate,
    ExtraPublicData,
    StructuredProblemReport,
    StructuredProblemReportDataWithExtraData,
} from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

import { UNIT_TEST_ERROR_TABLE, UnitTestErrorTable } from "./ErrorTable";

export interface NeverAdultAgeExtraData extends ExtraPublicData {
    public: {
        input: number;
    };
}

export type NeverAdultAgeTemplate = ErrorTableTemplate<
    UnitTestErrorTable,
    "never-adult-age"
>;
export type NeverAdultAgeData = StructuredProblemReportDataWithExtraData<
    UnitTestErrorTable,
    "never-adult-age",
    NeverAdultAgeTemplate,
    NeverAdultAgeExtraData
>;
export type NeverAdultAgeSRP = StructuredProblemReport<
    UnitTestErrorTable,
    "never-adult-age",
    NeverAdultAgeTemplate,
    NeverAdultAgeExtraData,
    NeverAdultAgeData
>;

export class NeverAdultAgeError extends AppError<
    UnitTestErrorTable,
    "never-adult-age",
    NeverAdultAgeTemplate,
    NeverAdultAgeExtraData,
    NeverAdultAgeData,
    NeverAdultAgeSRP
> {
    public constructor(params: AppErrorParams & NeverAdultAgeExtraData) {
        const errorData: NeverAdultAgeData = {
            template: UNIT_TEST_ERROR_TABLE["never-adult-age"],
            errorId: params.errorId,
            extra: {
                public: params.public,
            },
        };

        super(StructuredProblemReport.from(errorData));
    }
}