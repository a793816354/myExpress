export const notFoundPage = function () {
  this.res.statusCode = 404;
  return this.response.send("<div>page not found!!</div>");
};

export const errMethodPage = function () {
  this.res.statusCode = 405;
  return this.response.send("<div>err method!!</div>");
};
