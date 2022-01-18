import http from "http";

const nextFunc = (ctx, iter) => {
  const { done, value } = iter.next();
  ctx.done = done;
  ctx.value = value;
};

const initNextStatus = (ctx) => {
  ctx.done = true;
  ctx.value = null;
};

const runCallBacks = function (callbacks, url) {
  const temp = { done: true, value: null };
  const iter = callbacks[Symbol.iterator]();

  nextFunc(temp, iter);
  while (!temp.done && typeof temp.value === "function") {
    const { value } = temp;

    initNextStatus(temp);
    value(this.req, this.res, nextFunc.bind(null, temp, iter));
  }
};

const notFoundPage = function () {
  this.res.statusCode = 404;
  return this.res.send("<div>page not found!!</div>");
};

const errMethodPage = function () {
  this.res.statusCode = 405;
  return this.res.send("<div>err method!!</div>");
};

const isMatched = (routeUrl, url) => {
  // console.log(routeUrl);
  // console.log(url);

  return new RegExp(`^${routeUrl}$`).test(url);
};

class Request {
  request: any;
  constructor(req) {
    this.request = req;
  }
}
class Response {
  response: any;
  constructor(res) {
    this.response = res;
  }
  send(result) {
    this.response.end(result);
  }
}

class ExpressApp {
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

  invoke({ url, method }) {
    for (let index = 0; index < this.routes.length; index++) {
      const curRoute = this.routes[index];
      const { method: routeMethod, url: routeUrl, callbacks } = curRoute;
      if (!isMatched(routeUrl, url)) continue;

      if (routeMethod === "use") {
        runCallBacks.call(this, callbacks);
        continue;
      }

      if (routeMethod !== method) {
        errMethodPage.call(this);
        continue;
      }

      runCallBacks.call(this, callbacks, url);
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
    const { url, method } = req;
    app.req = new Request(req);
    app.res = new Response(res);
    app.invoke({ url, method: method.toLowerCase() });
  });
  app.server = server;
  // console.log(app);

  return app;
}
