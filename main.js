var MjpegCamera = require('mjpeg-camera');
var FileOnWrite = require('file-on-write');

var cameraName = 'nano-pi';

var camera = new MjpegCamera({
  name: cameraName,
  url: 'http://127.0.0.1:8080/?action=stream',
});

var motionWriter = new FileOnWrite({
  path: 'frames',
  filename: function(frame) {
    return frame.name + '-' + frame.time;
  },
  // We need to pull the jpeg out of the frame object
  transform: function(frame) {
    return frame.data;
  },
  ext: '.jpg'
});

camera.pipe(motionWriter)
