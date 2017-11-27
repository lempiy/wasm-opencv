var Module = {};
importScripts('cv-wasm.js');
self.onmessage = function (e) {
	switch (e.data.cmd) {
		case 'imageNew':
        getContours(e.data.img);
			break;
	}
}
console.log('done loading worker')
postMessage({msg: 'data'});

setTimeout(function() {
}, 1000)

function getContours(imageData) {
    let tresh = 100;
    let max_tresh = 255;
    let img = cv.matFromArray(imageData, 24);
    let img_gray = new cv.Mat();
    let img_trsh = new cv.Mat();
    let dst = cv.Mat.zeros(img.cols, img.rows, cv.CV_8UC4);
    console.log(img.size())
    cv.cvtColor(img, img_gray, cv.ColorConversionCodes.COLOR_RGBA2GRAY.value, 0);
    console.log(img_gray)
    cv.threshold(img_gray, img_trsh, 120, 200, cv.ThresholdTypes.THRESH_BINARY.value);
    console.log(img_trsh)
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    
    cv.findContours(img_trsh, contours, hierarchy, cv.RetrievalModes.RETR_CCOMP.value, cv.ContourApproximationModes.CHAIN_APPROX_SIMPLE.value, [0,0])
    
    for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                                  Math.round(Math.random() * 255));
        console.log(contours.get(i))
    }
    img.delete(); img_trsh.delete(); img_gray.delete(); dst.delete(); contours.delete(); hierarchy.delete();
}
