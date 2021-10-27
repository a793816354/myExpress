const initNextStatus = (nextObj) => {
  nextObj.done = true;
  nextObj.value = null;
};

const nextFunc = (nextObj, iter) => {
  const { done, value } = iter.next();
  nextObj.done = done;
  nextObj.value = value;
};

export { initNextStatus, nextFunc };
