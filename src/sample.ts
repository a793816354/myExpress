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
    value(this.request, this.response, nextFunc.bind(null, temp, iter));
  }
};

const notFoundPage = function () {
  this.res.statusCode = 404;
  return this.response.send("<div>page not found!!</div>");
};

const errMethodPage = function () {
  this.res.statusCode = 405;
  return this.response.send("<div>err method!!</div>");
};

const isMatched = (routeUrl, url) => {
  // console.log(routeUrl);
  // console.log(url);

  return new RegExp(`^${routeUrl}$`).test(url);
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

class Request {
  constructor(private app) {
    this.app = app;
  }
}

class ExpressApp {
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
    init(app, req, res);
    const { url, method } = req;
    app.invoke({ url, method: method.toLowerCase() });
  });
  app.server = server;
  // console.log(app);

  return app;
}
