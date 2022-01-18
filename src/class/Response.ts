export default class Response {
  response: any;
  constructor(res) {
    this.response = res;
  }
  send(result) {
    this.response.end(result);
  }
}
