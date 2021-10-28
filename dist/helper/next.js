"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextFunc = exports.initNextStatus = void 0;
const initNextStatus = (nextObj) => {
    nextObj.done = true;
    nextObj.value = null;
};
exports.initNextStatus = initNextStatus;
const nextFunc = (nextObj, iter) => {
    const { done, value } = iter.next();
    nextObj.done = done;
    nextObj.value = value;
};
exports.nextFunc = nextFunc;
