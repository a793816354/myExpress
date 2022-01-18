import myExpress from "../src";
import fs from "fs";
const app = myExpress();
const port = 3006;

app.use("/.*", (req, res) => {
  console.log("you got it!");
});

app.get("/hello", (req, res) => {
  console.log(req);
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

app.get("/", (req, res, next) => {
  const html = fs.readFileSync("./index.html");
  console.log(res);

  res.response.setHeader("cache-control", "max-age:3000000");
  res.send(html);
});

console.log(app);
app.listen(port, "local.wemomo.com", () => {
  console.log("启动成功");
});
