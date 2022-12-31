import Center from "../../components/Center";
import React, {
    useEffect, useState
} from "react";
import {
    Button
} from "@mui/material";
import HeadBar from "../../components/HeadBar";
import style from "../../styles/ShaiZi.module.scss";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "掷骰子",
    level: "log", // 空字符串时，不显示任何信息
});
function ShaiZi(): JSX.Element {
    var leftX: number = 150;
    var topY: number = 100;
    var diceX: number = 80;
    var diceY: number = 80;
    var dotR: number = 4;
    var count: number = 0;
    var [lastNum, setLastNum] = useState<number>(0);
    var flag: boolean = false;
    function clickMe(): boolean | void {
        logger.log("已开始掷骰子。");
        count = 0;
        if (flag) {
            return false;
        }
        flag = true;
        var ctx = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d");
        ctx.beginPath();
        //ctx.arc(100,100,50,0,Math.PI,false);
        ctx.strokeRect(leftX, topY, diceX, diceY);
        setTimeout(function () {
            random(ctx);
        }, 200);
    }
    function drawDice(ctx: CanvasRenderingContext2D, randomNum: number) {
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
    function random(ctx: CanvasRenderingContext2D) {
        var randomNum = Math.floor(Math.random() * 6) + 1;
        if (randomNum == lastNum) {
            random(ctx);
        } else {
            setLastNum(randomNum);
            drawDice(ctx, randomNum);
            logger.log(`骰子的点数为${lastNum}`);
        }
    }
    function commonDraw(ctx: CanvasRenderingContext2D, dotX: number, dotY: number) {
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
        logger.log("已画出1个点。");
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
        logger.log("已画出2个点。");
    }
    function draw3() {
        draw1();
        draw2();
        logger.log("已画出3个点。");
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
        logger.log("已画出4个点。");
    }
    function draw5() {
        draw1();
        draw4();
        logger.log("已画出5个点。");
    }
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
        logger.log("已画出6个点。");
    }
    useEffect(function () {
        var ct = document.getElementById("canvas") as HTMLCanvasElement;
        var ctx = ct.getContext("2d");
        ctx.beginPath();
        ctx.strokeRect(leftX, topY, diceX, diceY);
        ctx.stroke();
        draw6();
        logger.log("已初始化。");
    });
    return (
        <div className={style["allWidth"]}>
            <HeadBar isIndex={false} pageName="掷骰子" />
            <br />
            <Center>
                <canvas id="canvas" height="300" width="400" className={style["canvas"]}>
                    你的浏览器不支持这个工具。
                </canvas>
                <br />
                <Button type="button" variant="contained" onClick={clickMe}>掷骰子</Button>
            </Center>
        </div>
    );
};
export default ShaiZi;