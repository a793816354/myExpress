export const notFoundPage = function () {
  this.res.response.statusCode = 404;
  return this.res.send("<div>page not found!!</div>");
};

export const errMethodPage = function () {
  this.res.response.statusCode = 405;
  return this.res.send("<div>err method!!</div>");
};
