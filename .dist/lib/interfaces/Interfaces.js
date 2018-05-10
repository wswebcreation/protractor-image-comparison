"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("./protractor/protractor");
class Interfaces {
    protractor(options) {
        return new protractor_1.default(options);
    }
}
module.exports = new Interfaces();
//# sourceMappingURL=Interfaces.js.map