import http from "http";

const notFoundPage = function () {
  return this.end("<div>page not found!!</div>");
};

const init = (app, req, res) => {
  app.req = req;
  app.res = res;

  app.send = res.end;
};

class ExpressApp {
  map = { get: [] };
  callbackMap = {};
  req = null;
  res = null;
  server = null;

  get(url, ...args) {
    if (args.some((item) => typeof item !== "function"))
      throw new Error("中间件为函数");

    this.callbackMap[url] = args;
  }

  invoke(url) {
    const callbacks = this.callbackMap[url];
    console.log(callbacks);
    if (!callbacks) return notFoundPage.bind(this.res);
    for (let index = 0; index < callbacks.length; index++) {
      callbacks[index](this.res, this.req);
    }
  }

  listen(port, host, callback) {
    this.server.listen(port, host, callback);
  }
}

export default function myExpress() {
  const app = new ExpressApp();
  const server = http.createServer(function (req, res) {
    init(app, req, res);
    const { url } = req;
    app.invoke(url);
  });
  app.server = server;
  console.log(app);

  return app;
}
