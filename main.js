var MjpegCamera = require('mjpeg-camera');
var FileOnWrite = require('file-on-write');
var fs = require('fs');

// Create a writable stream to generate files
var fileWriter = new FileOnWrite({
  path: './frames',
  ext: '.jpeg',
  filename: function(frame) {
    return frame.name + '-' + frame.time;
  },
  transform: function(frame) {
    return frame.data;
  }
});

// Create an MjpegCamera instance
var camera = new MjpegCamera({
  name: 'backdoor',
  url: 'http://192.168.43.63:8080/?action=stream',
  motion: false
});

// Pipe frames to our fileWriter so we gather jpeg frames into the /frames folder
camera.pipe(fileWriter);

// Start streaming
camera.start();

setTimeout(function() {
  camera.stop();
}, 10*1000);
