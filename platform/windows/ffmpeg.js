const spawn = require("child_process").spawn;
const pathlib = require("path");

class FFMPEG {
  /**
   * Valid scales 640x480 160x120 176x144 320x176 320x240 352x288 432x240 544x288 640x360
   */
  constructor(
    devcamera,
    opts = {
      size: "800x600",
      drive: "v4l2",
      framerate: "25",
      savepath: "./",
      out: "out"
    }
  ) {
    this.cam = devcamera;
    this.opts = opts;
  }

  save_frames(path = null) {
    this._capture(path, "%010d.jpg");
  }

  save_video(path = null) {
    this._capture(path, ".avi");
  }

  _capture(path = null, format = ".avi") {
    if (this.process) this.process.kill("SIGKILL");
    this.process = spawn(
      __dirname + "/ffmpeg.exe",
      [
        "-y",
        "-f",
        this.opts.drive,
        "-framerate",
        this.opts.framerate.toString(),
        "-i",
        this.cam,
        "-r",
        this.opts.framerate.toString(),
        "-vf",
        `scale=${this.opts.size.split("x").join(":")}`,
        (path || this.opts.savepath) + pathlib.sep + this.opts.out + format
      ],
      { detached: true }
    );
    if (process.env.NODE_ENV === "development")
        this.process.stderr.on("data", d => console.log(d.toString()));
  }

  get FFMPEGProcess() {
    return this.process;
  }

  stop(signal = "SIGKILL") {
    if (this.process) {
      try {
        process.kill(this.process.pid, signal);
        this.process = null;
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports = FFMPEG;
