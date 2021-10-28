"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMatched = void 0;
const isMatched = (routeUrl, url) => {
    return new RegExp(`^${routeUrl}$`).test(url);
};
exports.isMatched = isMatched;
