import http from "http";
import fs from "fs";
import { URL } from "url";
const server = http.createServer((req, res) => {
  const { url } = req;
  let result = null;

  switch (url) {
    case "/getTime":
      result = new Date().valueOf();
      break;
    case "/getConfig":
      fs.writeFileSync("../public/config", "such a good day!");
      fs.appendFileSync("../public/config", "i agree!");
      result = fs.readFileSync("../public/config").toString();
  }

  res.end(`${result}`);
});

server.listen(3006, "local.wemomo.com", () => {
  console.log("启动成功");
});
