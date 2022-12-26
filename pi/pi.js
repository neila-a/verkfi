var isuas = false;
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
        var r = String(pi / (10n ** 20n)).replace(/(.{1})/,'$1\.');
        var r = Number(r);
        return r.toFixed(weishu);
    }
    if (isuas == true) {
        alert(pi(weishu));
    } else if (isuas == false) {
        document.getElementById("outend").innerHTML = pi(weishu);
    }
}
function setconfig() {
    var isuasel = document.getElementById("isUseAlertShow");
    window.isuas = isuasel.checked;
    var outaera = document.getElementById("out");
    if (isuas == true) {
        outaera.style.display = "none";
    } else if (isuas == false) {
        outaera.style.display = "";
    }
}