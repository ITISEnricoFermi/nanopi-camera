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

    if (process.platform === "win32")
      this.adapter = new (require("./platform/windows/ffmpeg"))("0");
    if (process.platform === "linux")
      this.adapter = new (require("./platform/linux/ffmpeg"))();
    if (process.platform === "darwin")
      this.adapter = new (require("./platform/mac/ffmpeg"))();

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

    this.name = this.opts.cameraName || "camera"; //prefix for each frame (helps processing)

    this.camera = null;

    this._init();
  }

  _init() {
    this.camera = null;
  }

  set Running(to) {
    if (!(to instanceof Boolean)) {
      throw new Error("Running is a boolean");
    }
    this.running = to;
  }

  get Running() {
    return this.running;
  }

  start() {
    if (this.Running) {
      this.stop();
      this._init();
    }
    //this.camera.start();
    this.Running = true;
  }

  stop() {
    if (this.camera && this.Running) {
      this.camera.stop();
      this.Running = false;
      this.camera = null;
    }
  }
}

module.exports = Camera;
