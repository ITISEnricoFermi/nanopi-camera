const mkdirp = require("mkdirp");

class Camera {
  /**
   *
   * @param {{streamUrl:string, rootdir:string, cameraName:string}} opts
   */
  constructor(opts = {}) {
    this.opts = opts;
    this.running = false;
    this.opts["rootdir"] =
      (this.opts.rootdir || "./") + new Date().getTime().toString();
    this.name = this.opts.cameraName || "camera"; //prefix for each frame (helps processing)

    if (process.platform === "win32")
      this.adapter = new (require("./platform/windows/ffmpeg"))("0", {
        savepath: this.opts.rootdir,
        out: this.name,
        framerate: 1,
        drive: "vfwcap",
        size: "320x176"
      });
    if (process.platform === "linux")
      this.adapter = new (require("./platform/linux/ffmpeg"))("/dev/video0", {
        savepath: this.opts.rootdir,
        out: this.name,
        framerate: 1,
        drive: "v4l2",
        size: "320x176"
      });
    if (process.platform === "darwin")
      throw new Error("Not implemented for Mac");

    this._restart();
  }

  _restart(newOpts) {
    if (newOpts) {
      this.opts = newOpts;
      this.opts.rootdir =
        (this.opts.rootdir || "./") + new Date().getTime().toString();
    }

    if ("rootdir" in this.opts) {
      mkdirp(this.opts.rootdir);
    }

    this._init();
  }

  _init() {
    this.camera = this.adapter;
  }

  set Running(to) {
    this.running = to;
  }

  get Running() {
    return this.running;
  }

  start() {
    if (this.Running) {
      this.stop();
      this._init();
    } else {
      this.camera.save_frames();
      this.Running = true;
    }
  }

  stop() {
    if (this.Running) {
      this.camera.stop();
      this.Running = false;
    }
  }
}

module.exports = Camera;
