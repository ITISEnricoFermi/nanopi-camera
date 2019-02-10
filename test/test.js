process.env.NODE_ENV = "development";

const Camera = require("../Camera");

const adapter = new Camera({
  cameraName: "test",
  rootdir: __dirname + "/hello/"
});
adapter.start();

process.on("SIGKILL", s => {
  adapter.stop();
  process.exit(0);
});
process.on("SIGINT", s => {
  adapter.stop();
  process.exit(0);
});
process.on("SIGTERM", s => {
  adapter.stop();
  process.exit(0);
});
setTimeout(() => adapter.stop(), 20000);
