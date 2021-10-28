export default class Response {
  constructor(private app) {
    this.app = app;
  }
  send(result) {
    this.app.res.end(result);
  }
}
