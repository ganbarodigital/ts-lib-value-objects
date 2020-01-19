"use strict";
// tslint:disable-next-line:no-var-requires
const TSConsoleReporter = require("jasmine-ts-console-reporter");
jasmine.getEnv().clearReporters(); // Clear default console reporter
jasmine.getEnv().addReporter(new TSConsoleReporter());
//# sourceMappingURL=ts_console.js.map