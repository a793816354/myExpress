export const isMatched = (routeUrl, url) => {
  return new RegExp(`^${routeUrl}$`).test(url);
};
