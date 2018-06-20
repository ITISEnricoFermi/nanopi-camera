const ffmpeg = require('ffmpeg')

try {
	var process = new ffmpeg('./tmp/your_movie.avi');
	process.then(function (video) {

		video
		.setVideoSize('640x?', true, true, '#fff')
		.save('./your_movie.avi', function (error, file) {
			if (!error)
				console.log('Video file: ' + file);
		});

	}, function (err) {
		console.log('Error: ' + err);
	});
} catch (e) {
	console.log(e.code);
	console.log(e.msg);
}
