import http from "http";
import ExpressApp from "./class/App";
import Request from "./class/Request";
import Response from "./class/Response";

export default function myExpress() {
  const app = new ExpressApp();

  const server = http.createServer(function (req, res) {
    // 享元模式，用一个app，不断调整新请求的req和res
    app.req = new Request(req);
    app.res = new Response(res);
    const { url, method } = req;
    app.invoke({ url, method: method.toLowerCase() });
  });
  app.server = server;

  return app;
}
