var Module = {};
importScripts('cv-wasm.js');
self.onmessage = function (e) {
	switch (e.data.cmd) {
        case 'imageNew':
        console.log('data', e.data)
        getContours(e.data.img, e.data.json);
            break;
        case 'click':
            console.log('datar', [e.data.coor.x, e.data.coor.y])
            drawSegment([e.data.coor.x, e.data.coor.y])
            break;
	}
}
console.log('done loading worker')
postMessage({msg: 'data'});
let contours, hierarchy, dst, w, h;

function drawSegment(point) {
    for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
            Math.round(Math.random() * 255), 255);
        if (cv.pointPolygonTest(contours.get(i), point, false) == 1) {
            console.log(cv.pointPolygonTest(contours.get(i), point, false) == 1)
            cv.drawContours(dst, contours, i, color, cv.LineTypes.FILLED.value, cv.LineTypes.LINE_8.value, hierarchy, 100, [0,0]);
        }
    }
    postMessage({msg: new ImageData(new Uint8ClampedArray(dst.data()), w, h)});
}

function getContours(imageData, json) {
    let tresh = 1;
    let max_tresh = 1;
    w = imageData.width;
    h = imageData.height;
    let img = cv.matFromArray(imageData, cv.CV_8UC4);

    
    dst = cv.Mat.zeros(img.cols, img.rows, cv.CV_8UC4);

    img.convertTo(dst, cv.CV_8U, 1, 0);


    cv.cvtColor(img, img, cv.ColorConversionCodes.COLOR_RGBA2GRAY.value, 0);

    cv.threshold(img, img, tresh, max_tresh, cv.ThresholdTypes.THRESH_BINARY.value);

    contours = new cv.MatVector();
    hierarchy = new cv.Mat();

    cv.findContours(img, contours, hierarchy, cv.RetrievalModes.RETR_CCOMP.value, cv.ContourApproximationModes.CHAIN_APPROX_SIMPLE.value, [0,0])

    let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
    Math.round(Math.random() * 255), 255);

    for (let i = 0; i < contours.size(); ++i) {
        let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
            Math.round(Math.random() * 255), 255);
        console.log(cv.pointPolygonTest(contours.get(i), [251, 251], false) == 1)
        if (cv.pointPolygonTest(contours.get(i), [252, 165], false) == 1) {
            console.log(contours.get(i))
            cv.drawContours(dst, contours, i, color, cv.LineTypes.FILLED.value, cv.LineTypes.LINE_8.value, hierarchy, 100, [0,0]);
        }
    }
    
    postMessage({msg: new ImageData(new Uint8ClampedArray(dst.data()), imageData.width, imageData.height)});
    img.delete();
}

function setGrid(imageData, json) {
    const arr = json.segment_0.reduce((acc, arr, i) => {
        return acc.concat(...(arr.map((a, i) => [...a, a[0] ? 1 : 0])))
    },[])
    
    const data = Uint8Array.from(arr, x => x > 0 ? 255 : 0)
    const imd = new ImageData(new Uint8ClampedArray(data), imageData.width, imageData.height)

    let flt = cv.matFromArray(imd, cv.CV_8UC4);

    postMessage({msg: new ImageData(new Uint8ClampedArray(flt.data()), imageData.width, imageData.height)});
    flt.delete();
}
