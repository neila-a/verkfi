import {
    dDivR
} from "../../shared/matrix/matrix";
const width = 512,
    height = 512,
    textSize = 500;
export default function getTextCanvas(text: string) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    ctx.font = textSize + "px \" bold";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / dDivR, height / dDivR);
    return canvas;
}
