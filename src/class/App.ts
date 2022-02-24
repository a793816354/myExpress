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

  //匹配调用
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

    //最终如果没有end，但是走完了，会返回404，参照express
    // return notFoundPage.call(this);
  }

  // iterator方式运行回掉
  runCallBacks(callbacks) {
    const nextObj = { done: true, value: null };
    const iter = callbacks[Symbol.iterator]();

    nextFunc(nextObj, iter);
    while (!nextObj.done && typeof nextObj.value === "function") {
      const { value } = nextObj;

      initNextStatus(nextObj);
      value(this.req, this.res, nextFunc.bind(null, nextObj, iter));
    }
  }

  listen(port, host, callback) {
    this.server.listen(port, host, callback);
  }
}
