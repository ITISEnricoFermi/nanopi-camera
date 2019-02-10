process.env.NODE_ENV = "development";

const adapter = new (require("../platform/windows/ffmpeg"))("0", {
  savepath: __dirname + "\\hello\\",
  out: "hello",
  framerate: 1,
  drive: "vfwcap",
  size: "320x176"
});
adapter.save_frames();

process.on("SIGKILL", s => {
  adapter.FFMPEGProcess.kill(s);
  process.exit(0);
});
process.on("SIGINT", s => {
  adapter.FFMPEGProcess.kill(s);
  process.exit(0);
});
process.on("SIGTERM", s => {
  adapter.FFMPEGProcess.kill(s);
  process.exit(0);
});
setTimeout(() => adapter.stop(), 20000);
