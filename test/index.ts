import myExpress from "../src";
import fs from "fs";
const app = myExpress();
const port = 3006;

app.use("/.*", (req, res) => {
  console.log("you got it!");
});

app.get("/hello", (req, res) => {
  res.response.setHeader("Set-Cookie", [
    "type=ninja;httponly;path=/hello",
    "language=javascript;max-age=3333",
  ]);

  res.send("Hello World!");
});

app.get(
  "/getTime",
  (req, res, next) => {
    res.time = new Date().valueOf();
    next();
  },
  (req, res, next) => {
    res.send(`${res.time}`);
  }
);

app.get("/common.css", (req, res, next) => {
  const css = fs.readFileSync("./common.css");
  res.send(css);
});

app.get("/importCss.css", (req, res, next) => {
  const css = fs.readFileSync("./importCss.css");
  res.send(css);
});

app.get("/importCss2.css", (req, res, next) => {
  const css = fs.readFileSync("./importCss2.css");
  res.send(css);
});

app.get("/", (req, res, next) => {
  const html = fs.readFileSync("./index.html");
  res.send(html);
});

app.listen(port, "local.wemomo.com", () => {
  console.log("启动成功");
});
