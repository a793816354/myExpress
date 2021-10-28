import myExpress from "../src";
const app = myExpress();
const port = 3006;

app.use("/.*", (req, res) => {
  console.log("you got it!");
});

app.get("/hello", (req, res) => {
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

console.log(app);
app.listen(port, "local.wemomo.com", () => {
  console.log("启动成功");
});
