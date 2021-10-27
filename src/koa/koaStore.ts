import http from "http";

class Ctx {
  done = true;
  value = null;
}

const ctxFactory = () => {
  const ctx = new Ctx();

  Reflect.defineProperty(ctx, "body", {
    set(val) {
      console.log(val);
      initNextStatus(ctx);
    },
  });
  return ctx;
};

const nextFunc = (ctx, iter) => {
  const { done, value } = iter.next();
  ctx.done = done;
  ctx.value = value;
};

const initNextStatus = (ctx) => {
  ctx.done = true;
  ctx.value = null;
};

const runCallBacks = function (callbacks) {
  const ctx = ctxFactory();
  const iter = callbacks[Symbol.iterator]();

  nextFunc(ctx, iter);
  while (!ctx.done && typeof ctx.value === "function") {
    const { value } = ctx;
    initNextStatus(ctx);
    value({}, this.response, nextFunc);
  }
};

const notFoundPage = function () {
  this.res.statusCode = 404;
  return this.response.send("<div>page not found!!</div>");
};

const errMethodPage = function () {
  this.res.statusCode = 405;
  return this.response.send("<div>page not found!!</div>");
};

const isMathed = (routeUrl, url) => {
  return new RegExp(routeUrl).test(url);
};

const init = (app, req, res) => {
  app.req = req;
  app.res = res;
};

class Response {
  constructor(private app) {
    this.app = app;
  }
  send(result) {
    this.app.res.end(result);
  }
}

class ExpressApp {
  routes = [];
  req = null;
  res = null;
  server = null;
  response = new Response(this);

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
      if (!isMathed(routeUrl, url)) continue;

      if (routeMethod === "use") {
        runCallBacks.call(this, callbacks);
        continue;
      }

      if (routeMethod !== method) {
        errMethodPage.call(this);
        continue;
      }

      return runCallBacks.call(this, callbacks);
    }

    return notFoundPage.call(this);
  }

  listen(port, host, callback) {
    this.server.listen(port, host, callback);
  }
}

export default function myExpress() {
  const app = new ExpressApp();
  const server = http.createServer(function (req, res) {
    init(app, req, res);
    const { url, method } = req;
    app.invoke({ url, method: method.toLowerCase() });
  });
  app.server = server;
  // console.log(app);

  return app;
}
