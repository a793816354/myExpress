import myExpress from "../src/express";
console.log(myExpress);
const app = myExpress();
const port = 3006;

app.get("/", (req, res) => {
  console.log(87777);
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
// console.log(app.listen);
console.log(app);
// @ts-ignore: Unreachable code error
console.log(app.listen);
// @ts-ignore: Unreachable code error
app.listen(port, "local.wemomo.com", () => {
  console.log("启动成功");
});
