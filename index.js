let wasmWorker = new Worker('wasm-worker.js');

window.onload = function() {
    var c=document.getElementById("myCanvas");
    var co=document.getElementById("outCanvas");
    var ctx=c.getContext("2d");
    var ctxo=co.getContext("2d");
    var img= new Image();
    img.src = "./images/pizza_annotated_boundry.png";

    

    wasmWorker.onmessage = function (e) {
        perfwasm1 = performance.now();
        console.log(`WASM: ${perfwasm1}`, e.data);
        if (e.data.msg instanceof ImageData) {
            console.log(ctx.getImageData(0, 0, c.width, c.height), e.data.msg)
            console.log()
            ctxo.putImageData(e.data.msg, 0, 0)
        }
    }
    img.onload = function() {
        c.width = img.width
        co.width = img.width
        c.height = img.height
        co.height = img.height
        ctx.drawImage(img,0,0);
        fetch('images/pizza_RGB.json')
        .then(function(response) {
            return response.json()
        })
        .then(function(json) {
            setTimeout(() => {
                sendImageData(json)
            }, 500)
        })
    }
    function sendImageData(json) {
        let message = { cmd: 'imageNew', img: ctx.getImageData(0, 0, c.width, c.height), json: json};
        wasmWorker.postMessage(message);
    }    
};

