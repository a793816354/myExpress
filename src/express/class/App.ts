import Request from "./Request";
import Response from "./Response";
import { nextFunc, initNextStatus } from "../helper/next";
import { isMatched } from "../helper/utils";
import { notFoundPage, errMethodPage } from "../helper/page";

export default class ExpressApp {
  routes = [];
  req = null;
  res = null;
  server = null;
  response = new Response(this);
  request = new Request(this);

  get(url, ...args) {
    if (args.some((item) => typeof item !== "function"))
      throw new Error("中间件为函数");

    this.routes.push({
      method: "get",
      url,
      callbacks: args,
    });
  }

  invoke({ url, method }) {
    for (let index = 0; index < this.routes.length; index++) {
      const curRoute = this.routes[index];
      const { method: routeMethod, url: routeUrl, callbacks } = curRoute;
      if (!isMatched(routeUrl, url)) continue;

      if (routeMethod === "use") {
        this.runCallBacks(callbacks);
        continue;
      }

      if (routeMethod !== method) {
        errMethodPage.call(this);
        continue;
      }

      this.runCallBacks(callbacks);
    }

    return notFoundPage.call(this);
  }

  runCallBacks(callbacks) {
    const nextObj = { done: true, value: null };
    const iter = callbacks[Symbol.iterator]();

    nextFunc(nextObj, iter);
    while (!nextObj.done && typeof nextObj.value === "function") {
      const { value } = nextObj;

      initNextStatus(nextObj);
      value(this.request, this.response, nextFunc.bind(null, nextObj, iter));
    }
  }

  listen(port, host, callback) {
    this.server.listen(port, host, callback);
  }
}
