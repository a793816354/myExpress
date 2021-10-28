import http from "http";
import ExpressApp from "./class/App";

export default function myExpress() {
  const app = new ExpressApp();

  const server = http.createServer(function (req, res) {
    // 享元模式，用一个app，不断调整新请求的req和res
    app.req = req;
    app.res = res;

    const { url, method } = req;
    app.invoke({ url, method: method.toLowerCase() });
  });
  app.server = server;

  return app;
}
