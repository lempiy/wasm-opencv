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
    console.log(imageData)
    let tresh = 100;
    let max_tresh = 255;
    let img = cv.matFromArray(imageData, cv.CV_8UC4);
    let dst = cv.Mat.zeros(img.cols, img.rows, cv.CV_8UC4);
    console.log("IMG", cv, img, img.type(), cv.CV_8UC4)
    console.log(img.type())
    cv.cvtColor(img, img, cv.ColorConversionCodes.COLOR_RGBA2GRAY.value, 0);
    console.log(img.type())
    cv.threshold(img, img, tresh, max_tresh, cv.ThresholdTypes.THRESH_BINARY.value);
    console.log(img.type())
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(img, contours, hierarchy, cv.RetrievalModes.RETR_CCOMP.value, cv.ContourApproximationModes.CHAIN_APPROX_SIMPLE.value, [0,0])
    for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
            Math.round(Math.random() * 255), 255);
        cv.drawContours(dst, contours, i, color, 1, cv.LineTypes.LINE_8.value, hierarchy, 100, [0,0]);
    }
    console.log(dst.data())
    postMessage({msg: new ImageData(new Uint8ClampedArray(dst.data()), imageData.width, imageData.height)});
    img.delete(); dst.delete();contours.delete(); hierarchy.delete();
}
