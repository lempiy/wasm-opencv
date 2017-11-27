let wasmWorker = new Worker('wasm-worker.js');

wasmWorker.onmessage = function (e) {
    perfwasm1 = performance.now();
    console.log(`WASM: ${perfwasm1}`, e.data);
}

window.onload = function() {
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    var img= new Image();
    img.src = "./pizza.png";
    console.dir(img)
    img.onload = function() {
        c.width = img.width
        c.height = img.height
        ctx.drawImage(img,0,0);
        setTimeout(function() {
            sendImageData()
        }, 500)
    }
    function sendImageData() {
        let message = { cmd: 'imageNew', img: ctx.getImageData(0, 0, c.width || 200, c.height || 200)};
        wasmWorker.postMessage(message);
    }    
};

