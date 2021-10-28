"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errMethodPage = exports.notFoundPage = void 0;
const notFoundPage = function () {
    this.res.statusCode = 404;
    return this.response.send("<div>page not found!!</div>");
};
exports.notFoundPage = notFoundPage;
const errMethodPage = function () {
    this.res.statusCode = 405;
    return this.response.send("<div>err method!!</div>");
};
exports.errMethodPage = errMethodPage;
