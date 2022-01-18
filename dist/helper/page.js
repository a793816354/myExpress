"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errMethodPage = exports.notFoundPage = void 0;
const notFoundPage = function () {
    this.res.response.statusCode = 404;
    return this.res.send("<div>page not found!!</div>");
};
exports.notFoundPage = notFoundPage;
const errMethodPage = function () {
    this.res.response.statusCode = 405;
    return this.res.send("<div>err method!!</div>");
};
exports.errMethodPage = errMethodPage;
