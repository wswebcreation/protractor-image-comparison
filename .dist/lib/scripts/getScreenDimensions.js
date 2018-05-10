"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getScreenDimension() {
    const body = document.body;
    const html = document.documentElement;
    return {
        body: {
            scrollHeight: body.scrollHeight,
            offsetHeight: body.offsetHeight
        },
        html: {
            clientWidth: html.clientWidth,
            scrollWidth: html.scrollWidth,
            clientHeight: html.clientHeight,
            scrollHeight: html.scrollHeight,
            offsetHeight: html.offsetHeight
        },
        window: {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            pixelRatio: typeof window.devicePixelRatio === 'undefined' ? 1 : window.devicePixelRatio,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
        }
    };
}
exports.default = getScreenDimension;
//# sourceMappingURL=getScreenDimensions.js.map