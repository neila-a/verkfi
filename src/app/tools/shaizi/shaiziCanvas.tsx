import {
    get
} from 'react-intl-universal';
import {
    useState,
    useRef,
    useEffect
} from "react";
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
    const canvas = useRef();
    function clickMe(start: number | "random"): boolean | void {
        var lastNum = 0,
            leftX: number = 150,
            topY: number = 100,
            diceX: number = 80,
            diceY: number = 80,
            dotR: number = 4,
            count: number = 0,
            flag: boolean = false;
        function draw(points: number) {
            function commonDraw(ctx: CanvasRenderingContext2D, dotX: number, dotY: number) {
                ctx.beginPath();
                ctx.arc(dotX, dotY, dotR, 0, 2 * Math.PI, false);
                ctx.stroke();
                ctx.fill();
            }
            function draw1() {
                const ct = canvas.current as HTMLCanvasElement;
                const ctx = ct.getContext("2d");
                ctx.fillStyle = "#0000ff";
                var dotX = leftX + diceX / 2;
                var dotY = topY + diceY / 2;
                commonDraw(ctx, dotX, dotY);
                logger.log("已画出1个点。");
            }
            function draw2() {
                const ct = canvas.current as HTMLCanvasElement;
                const ctx = ct.getContext("2d");
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
                const ct = canvas.current as HTMLCanvasElement;
                const ctx = ct.getContext("2d");
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
                const ct = canvas.current as HTMLCanvasElement;
                const ctx = ct.getContext("2d");
                ctx.fillStyle = "#996633";
                var dotX = leftX + 4 * dotR;
                var dotY = topY + diceY / 2;
                commonDraw(ctx, dotX, dotY);
                var dotX = leftX + diceY - 4 * dotR;
                commonDraw(ctx, dotX, dotY);
                draw4();
                logger.log("已画出6个点。");
            }
        }
        function drawDice(ctx: CanvasRenderingContext2D, randomNum: number) {
            ctx.clearRect(leftX, topY, diceX, diceY);
            draw(randomNum);
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
            if (randomNum === lastNum) {
                random(ctx);
            } else {
                lastNum = randomNum;
                drawDice(ctx, randomNum);
                logger.log(`骰子的点数为${randomNum}`);
            }
        }
        logger.log("已开始掷骰子。");
        count = 0;
        if (flag) {
            return false;
        }
        flag = true;
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        ctx.beginPath();
        ctx.strokeRect(leftX, topY, diceX, diceY);
        setTimeout(function () {
            random(ctx);
        }, 200);
    }
    useEffect(function () {
        const ct = canvas.current as HTMLCanvasElement;
        const ctx = ct.getContext("2d");
        ctx.beginPath();
        ctx.strokeRect(leftX, topY, diceX, diceY);
        ctx.stroke();
        clickMe(6);
        logger.log("已初始化。");
    }, []);
    return (
        <canvas id="canvas" height="300" width="400" style={{
            maxWidth: "100%"
        }} ref={canvas} onClick={event => clickMe("random")}>
            {get('你的浏览器不支持这个工具。')}
        </canvas>
    );
}
