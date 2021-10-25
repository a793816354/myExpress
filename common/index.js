"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
fs_1.default.writeFileSync("../public/config", "such a good day! d");
fs_1.default.appendFileSync("../public/config", "i agree! d");
