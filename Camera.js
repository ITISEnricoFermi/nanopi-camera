const MjpegCamera = require('mjpeg-camera')
const FileOnWrite = require('file-on-write')
const mkdirp = require("mkdirp")

class Camera {
  /**
   *
   * @param {{streamUrl:string, rootdir:string, cameraName:string}} opts
   */
  constructor(opts) {
    this.opts = Object.assign({}, opts)
    this._restart()
  }

  _restart(newOpts) {
    if (newOpts) {
      this.opts = newOpts
    }

    if ("rootdir" in this.opts) {
      mkdirp(this.opts.rootdir)
    }

    this.streamUrl = this.opts.streamUrl
    this.name = this.opts.cameraName || "camera" //prefix for each frame (helps processing)

    let videoFolderName = (this.opts.rootdir || "./") + (new Date()).getTime().toString()

    this.motionWriter = new FileOnWrite({
      path: videoFolderName, // Unique folder for each video
      filename: function (frame) {
        return frame.name + '-' + frame.time
      },
      // We need to pull the jpeg out of the frame object
      transform: function (frame) {
        return frame.data
      },
      ext: '.jpg'
    })

    this.camera = null

    this._init()
  }

  _init() {
    this.camera = new MjpegCamera({
      name: this.name,
      url: this.streamUrl || 'http://127.0.0.1:8080/?action=stream',
    })
    this.camera.pipe(this.motionWriter)
    this.camera.start()
  }

  start() {
    this.stop()
    this._init()
  }

  stop() {
    if (this.camera) {
      this.camera.stop()
      this.camera = null
    }
  }
}

module.exports = Camera
