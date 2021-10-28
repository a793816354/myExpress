"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = __importDefault(require("./Request"));
const Response_1 = __importDefault(require("./Response"));
const next_1 = require("../helper/next");
const utils_1 = require("../helper/utils");
const page_1 = require("../helper/page");
class ExpressApp {
    constructor() {
        this.routes = [];
        this.req = null;
        this.res = null;
        this.server = null;
        this.response = new Response_1.default(this);
        this.request = new Request_1.default(this);
    }
    get(url, ...args) {
        if (args.some((item) => typeof item !== "function"))
            throw new Error("中间件为函数");
        this.routes.push({
            method: "get",
            url,
            callbacks: args,
        });
    }
    use(url, ...args) {
        if (args.some((item) => typeof item !== "function"))
            throw new Error("中间件为函数");
        this.routes.push({
            method: "use",
            url,
            callbacks: args,
        });
    }
    invoke({ url, method }) {
        for (let index = 0; index < this.routes.length; index++) {
            const curRoute = this.routes[index];
            const { method: routeMethod, url: routeUrl, callbacks } = curRoute;
            if (!utils_1.isMatched(routeUrl, url))
                continue;
            if (routeMethod === "use") {
                this.runCallBacks(callbacks);
                continue;
            }
            if (routeMethod !== method) {
                page_1.errMethodPage.call(this);
                continue;
            }
            this.runCallBacks(callbacks);
        }
        return page_1.notFoundPage.call(this);
    }
    runCallBacks(callbacks) {
        const nextObj = { done: true, value: null };
        const iter = callbacks[Symbol.iterator]();
        next_1.nextFunc(nextObj, iter);
        while (!nextObj.done && typeof nextObj.value === "function") {
            const { value } = nextObj;
            next_1.initNextStatus(nextObj);
            value(this.request, this.response, next_1.nextFunc.bind(null, nextObj, iter));
        }
    }
    listen(port, host, callback) {
        this.server.listen(port, host, callback);
    }
}
exports.default = ExpressApp;
