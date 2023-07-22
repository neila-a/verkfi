onmessage = event => {
    const edge = event.data[0],
        n = event.data[1],
        blocks = event.data[2];
    console.time("渲染圆");
    var canvas = new OffscreenCanvas(edge, edge);
    var size = edge / n;
    var cxt = canvas.getContext('2d');
    cxt.strokeStyle = "rgb(0, 0, 0)";
    cxt.fillStyle = "rgb(255, 0, 0)";
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            var have: boolean = false;
            blocks.forEach(value => {
                if (value[0] == i && value[1] == j) {
                    have = true;
                }
            })
            if (have) {
                cxt.rect(size * j, size * i, size, size);
            }
        }
    }
    cxt.fill();
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            cxt.rect(size * j, size * i, size, size);
        }
    }
    cxt.stroke();
    console.timeEnd("渲染圆");
    postMessage(canvas.transferToImageBitmap());
}
