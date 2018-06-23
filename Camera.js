const MjpegCamera = require("mjpeg-camera");
const FileOnWrite = require("file-on-write");
const mkdirp = require("mkdirp");

class Camera {
  /**
   *
   * @param {{streamUrl:string, rootdir:string, cameraName:string}} opts
   */
  constructor(opts) {
    this.opts = Object.assign({}, opts);
    this.running = false;
    this.opts.rootdir = (this.opts.rootdir || "./") + new Date().getTime().toString()
    this._restart();
  }

  _restart(newOpts) {
    if (newOpts) {
      this.opts = newOpts;
      this.opts.rootdir = (this.opts.rootdir || "./") + new Date().getTime().toString()
    }

    if ("rootdir" in this.opts) {
      mkdirp(this.opts.rootdir);
    }

    this.streamUrl = this.opts.streamUrl;
    this.name = this.opts.cameraName || "camera"; //prefix for each frame (helps processing)

    this.motionWriter = new FileOnWrite({
      path: this.opts.rootdir, // Unique folder for each video
      filename: function (frame) {
        return frame.name + "-" + frame.time;
      },
      // We need to pull the jpeg out of the frame object
      transform: function (frame) {
        return frame.data;
      },
      ext: ".jpg"
    });

    this.camera = null;

    this._init();
  }

  _init() {
    this.camera = new MjpegCamera({
      name: this.name,
      url: this.streamUrl || "http://127.0.0.1:8080/?action=stream"
    });
    this.camera.pipe(this.motionWriter);
  }

  isRunning() {
    return this.running;
  }

  start() {
    if (this.isRunning()) {
      this.stop();
      this._init();
    }
    this.camera.start()
    this.running = true;
  }

  stop() {
    if (this.camera && this.isRunning()) {
      this.camera.stop();
      this.running = false;
      this.camera = null;
    }
  }
}

module.exports = Camera;
