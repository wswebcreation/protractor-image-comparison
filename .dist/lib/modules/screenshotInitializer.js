"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const hideWindowScrollbars_1 = require("../scripts/hideWindowScrollbars");
const disableCssAnimations_1 = require("../scripts/disableCssAnimations");
const addShadowPadding_1 = require("../scripts/addShadowPadding");
function screenshotInitializer(executor, options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield executor(hideWindowScrollbars_1.default, options.hideScrollBars);
        yield executor(addShadowPadding_1.default, {
            addressBarShadowPadding: options.addressBarShadowPadding,
            toolBarShadowPadding: options.toolBarShadowPadding
        });
        yield executor(disableCssAnimations_1.default, options.disableCSSAnimation);
    });
}
exports.default = screenshotInitializer;
//# sourceMappingURL=screenshotInitializer.js.map