import myExpress from "../src";
console.log(myExpress);
const app = myExpress();
const port = 3006;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// console.log(app.listen);
console.log(app);
// @ts-ignore: Unreachable code error
console.log(app.listen);
// @ts-ignore: Unreachable code error
app.listen(3006, "local.wemomo.com", () => {
  console.log("启动成功");
});
