import {
    get
} from 'react-intl-universal';
import {
    useState,
    useRef,
    useEffect
} from "react";
import style from "styled-jsx/style";
import {
    logger
} from "./consts";
import {
    setState
} from '../../declare';
export function ShaiZiCanvas(props: {
    cishu: number;
    setCishu: setState<number>;
}): JSX.Element {
    var leftX: number = 150,
        topY: number = 100,
        diceX: number = 80,
        diceY: number = 80,
        dotR: number = 4,
        count: number = 0,
        [lastNum, setLastNum] = useState<number>(0),
        flag: boolean = false,
        canvas = useRef();
    function clickMe(): boolean | void {
        logger.log("已开始掷骰子。");
        count = 0;
        if (flag) {
            return false;
        }
        flag = true;
        var ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
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
        if (count >= props.cishu) {
            flag = false;
            return false;
        } else {
            setTimeout(function () {
                random(ctx);
            }, 200 - count);
        }
    }
    function random(ctx: CanvasRenderingContext2D) {
        var randomNum: number = 7;
        while (randomNum > 6 || randomNum < 1) {
            randomNum = Math.floor(Math.random() * 10);
        }
        if (randomNum == lastNum) {
            random(ctx);
        } else {
            setLastNum(randomNum);
            drawDice(ctx, randomNum);
            logger.log(`骰子的点数为${randomNum}`);
        }
    }
    function commonDraw(ctx: CanvasRenderingContext2D, dotX: number, dotY: number) {
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotR, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.fill();
    }
    function draw1() {
        var ct = canvas.current as HTMLCanvasElement;
        var ctx = ct.getContext("2d");
        ctx.fillStyle = "#0000ff";
        var dotX = leftX + diceX / 2;
        var dotY = topY + diceY / 2;
        commonDraw(ctx, dotX, dotY);
        logger.log("已画出1个点。");
    }
    function draw2() {
        var ct = canvas.current as HTMLCanvasElement;
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
        var ct = canvas.current as HTMLCanvasElement;
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
        var ct = canvas.current as HTMLCanvasElement;
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
        var ct = canvas.current as HTMLCanvasElement;
        var ctx = ct.getContext("2d");
        ctx.beginPath();
        ctx.strokeRect(leftX, topY, diceX, diceY);
        ctx.stroke();
        draw6();
        logger.log("已初始化。");
    }, []);
    return (
        <canvas id="canvas" height="300" width="400" className={style["canvas"]} ref={canvas} onClick={clickMe}>
            {get('你的浏览器不支持这个工具。')}
        </canvas>
    );
}
