import Head from "next/head";
function PI(): JSX.Element {
    interface confFace {
        isuas: boolean
    };
    var conf: confFace = {
        isuas: false
    };
    function start() {
        var weishu = document.getElementById("weishu").value;
        function pi(weishup) {
            var weishup = weishup + 20;
            var i = 1n;
            var x = 3n * (10n ** BigInt(weishup));
            var pi = x;
            while (x > 0) {
                x = x * i / ((i + 1n) * 4n);
                pi += x / (i + 2n);
                i += 2n;
            }
            var r = String(pi / (10n ** 20n)).replace(/(.{1})/, '$1\.');
            var r = Number(r);
            return r.toFixed(weishu);
        }
        if (conf.isuas == true) {
            alert(pi(weishu));
        } else if (conf.isuas == false) {
            document.getElementById("outend").innerHTML = pi(weishu);
        }
    }
    function setconfig() {
        var isuasel = document.getElementById("isUseAlertShow");
        conf.isuas = isuasel.checked;
        var outaera = document.getElementById("out");
        if (conf.isuas == true) {
            outaera.style.display = "none";
        } else if (conf.isuas == false) {
            outaera.style.display = "";
        }
    }
    function outLoad() {
        if (conf.isuas == true) {
            this.style.display = 'none';
        } else if (conf.isuas == false) {
            this.style.display = '';
        }
    };
    return (
        <>
            <Head>
                <style>{`
                    body {
                        border-radius: 100px;
                        border: 1px solid;
                        /* height: {{ window.screen.availHeight }}px; */
                    }
                    h1 {
                        text-align: center;
                        font-family: Cambria;
                    }
                    h2 {
                        padding-left: 1%;
                    }
                    div#input > *, #isUseAlertShow, #outendwm {
                        margin-left: 2%;
                    }
                    button {
                        background-color: #3399ff;
                        border-color: #3399ff;
                        border-radius: 100px;
                        color: #ffffff;
                    }
                    button:hover {
                        background-color: #ffffff;
                        color: #000000;
                    }
                    div#out {
                        margin-bottom: 50px;
                    }
                `}</style>
                <title>π计算器</title>
            </Head>
            <h1>π计算器</h1>
            <h2>π的小数点后位数：</h2>
            <div id="input">
                <input type="number" id="weishu" />
                <br />
                <button type="submit" onClick={start} onSubmit={start}>开始计算</button>
            </div>
            <h2>选项</h2>
            <input type="checkbox" id="isUseAlertShow" />用提示框显示结果
            <button onClick={setconfig}>设置</button>
            <div id="out" onLoad={outLoad}>
                <h2>结果</h2>
                <p id="outendwm">π是：<span id="outend"></span></p>
            </div>
        </>
    );
};
export default PI;