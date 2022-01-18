"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(res) {
        this.response = res;
    }
    send(result) {
        this.response.end(result);
    }
}
exports.default = Response;
