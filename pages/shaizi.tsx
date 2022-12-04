import Center from "../components/Center";
import React, {
    useEffect
} from "react";
import {
    Button
} from "@mui/material";
import HeadBar from "../components/HeadBar";
function ShaiZi(): JSX.Element {
    var leftX: number = 150;
    var topY: number = 100;
    var diceX: number = 80;
    var diceY: number = 80;
    var dotR: number = 4;
    var count: number = 0;
    var lastNum: number = 0;
    var flag: boolean = false;
    function clickMe() {
        count = 0;
        if (flag) {
            return false;
        }
        flag = true;
        var ct = document.getElementById("canvas") as HTMLCanvasElement;
        var ctx = ct.getContext("2d");
        ctx.beginPath();
        //ctx.arc(100,100,50,0,Math.PI,false);
        ctx.strokeRect(leftX, topY, diceX, diceY);

        setTimeout(function () {
            random(ctx);
        }, 200);

    }
    function drawDice(ctx, randomNum) {
        ctx.clearRect(leftX, topY, diceX, diceY);
        switch (randomNum) {
            case 1:
                draw1();
                break;
            case 2:
                draw2();
                break;
            case 3:
                draw3();
                break;
            case 4:
                draw4();
                break;
            case 5:
                draw5();
                break;
            case 6:
                draw6();
                break;
        }
        count++;
        if (count >= 20) {
            flag = false;
            return false;
        } else {
            setTimeout(function () {
                random(ctx);
            }, 200 - count);
        }
    }
    function random(ctx) {
        var randomNum = Math.floor(Math.random() * 6) + 1;
        if (randomNum == lastNum) {
            random(ctx)
        } else {
            lastNum = randomNum;
            drawDice(ctx, randomNum);
        }

    }
    function commonDraw(ctx, dotX, dotY) {
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotR, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
    }
    function draw1() {
        var ct = document.getElementById("canvas") as HTMLCanvasElement;
        var ctx = ct.getContext("2d");
        ctx.fillStyle = "#0000ff";
        var dotX = leftX + diceX / 2;
        var dotY = topY + diceY / 2;
        commonDraw(ctx, dotX, dotY);
    }
    function draw2() {
        var ct = document.getElementById("canvas") as HTMLCanvasElement;
        var ctx = ct.getContext("2d");
        ctx.fillStyle = "#99FF66";
        var dotX = leftX + 4 * dotR;
        var dotY = topY + 4 * dotR;
        commonDraw(ctx, dotX, dotY);
        var dotX = leftX + diceX - 4 * dotR;
        var dotY = topY + diceY - 4 * dotR;
        commonDraw(ctx, dotX, dotY);
    }
    function draw3() {
        draw1();
        draw2();
    }
    function draw4() {
        draw2();
        var ct = document.getElementById("canvas") as HTMLCanvasElement;
        var ctx = ct.getContext("2d");
        ctx.fillStyle = "#99CC00";
        var dotX = leftX + diceX - 4 * dotR;
        var dotY = topY + 4 * dotR;
        commonDraw(ctx, dotX, dotY);
        var dotX = leftX + 4 * dotR;
        var dotY = topY + diceY - 4 * dotR;
        commonDraw(ctx, dotX, dotY);
    }
    function draw5() {
        draw1();
        draw4();
    }
    //http://www.cnblogs.com/sosoft/
    function draw6() {
        var ct = document.getElementById("canvas") as HTMLCanvasElement;
        var ctx = ct.getContext("2d");
        ctx.fillStyle = "#996633";
        var dotX = leftX + 4 * dotR;
        var dotY = topY + diceY / 2
        commonDraw(ctx, dotX, dotY);
        var dotX = leftX + diceY - 4 * dotR;
        commonDraw(ctx, dotX, dotY);
        draw4();
    }
    function init() {
        var ct = document.getElementById("canvas") as HTMLCanvasElement;
        var ctx = ct.getContext("2d");
        ctx.beginPath();
        ctx.strokeRect(leftX, topY, diceX, diceY);
        ctx.stroke();
        draw6();
    }
    useEffect(init);
    return (
        <div style={{
            width: "100%"
        }}>
            <HeadBar isIndex={false} pageName="掷骰子" />
            <Center>
                <canvas onLoad={init} id="canvas" width="400" height="300" style={{
                    backgroundColor: "#3399ff"
                }}>
                    your brower is not support html5
                </canvas>
                <br></br>
                <Button type="button" variant="contained" onClick={clickMe}>掷骰子</Button>
            </Center>
        </div>
    );
};
export default ShaiZi;