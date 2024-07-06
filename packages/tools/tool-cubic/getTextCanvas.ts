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
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    context.font = textSize + "px \" bold";
    context.fillStyle = "#FFFFFF";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, width / dDivR, height / dDivR);
    return canvas;
}
