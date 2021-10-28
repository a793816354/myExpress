"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const App_1 = __importDefault(require("./class/App"));
function myExpress() {
    const app = new App_1.default();
    const server = http_1.default.createServer(function (req, res) {
        app.req = req;
        app.res = res;
        const { url, method } = req;
        app.invoke({ url, method: method.toLowerCase() });
    });
    app.server = server;
    return app;
}
exports.default = myExpress;
