var Recorder = require('rtsp-recorder');

var rec = new Recorder({
    url: 'http://192.168.43.63:8080/?action=stream', //url to rtsp stream
    timeLimit: 10, //length of one video file (seconds)
    folder: 'videos/', //path to video folder
    prefix: 'vid-', //prefix for video files
    movieWidth: 1280, //width of video
    movieHeight: 720, //height of video
    maxDirSize: 1024*20, //max size of folder with videos (MB), when size of folder more than limit folder will be cleared
    maxTryReconnect: 15 //max count for reconnects

});

//start recording
rec.initialize();
