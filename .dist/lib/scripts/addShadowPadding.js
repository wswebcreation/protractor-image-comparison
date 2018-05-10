"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addShadowPadding({ addressBarShadowPadding, toolBarShadowPadding }) {
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    const paddingBottom = toolBarShadowPadding === 0 ? '' : `body{padding-bottom:${toolBarShadowPadding}px !important}`;
    const paddingTop = addressBarShadowPadding === 0 ? '' : `body{padding-top:${addressBarShadowPadding}px !important}`;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(`${paddingBottom} ${paddingTop}`));
    head.appendChild(style);
}
exports.default = addShadowPadding;
//# sourceMappingURL=addShadowPadding.js.map