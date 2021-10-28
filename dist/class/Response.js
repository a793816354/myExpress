"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(app) {
        this.app = app;
        this.app = app;
    }
    send(result) {
        this.app.res.end(result);
    }
}
exports.default = Response;
