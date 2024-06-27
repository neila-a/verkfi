import {
    Canvas
} from "@react-three/fiber";
import {
    useEffect,
    useRef
} from "react";
import Cube from "./Cube";
import {
    ambientLightPosition
} from "@verkfi/tool-cubic/page";
export type rotateAxis = "x" | "y" | "z";
export const rotateAxis: rotateAxis[] = ["x", "y", "z"],
    rotateStep = 50, // 转90度所需要的帧
    randomAxis = () => rotateAxis[Math.floor(Math.random() * rotateAxis.length)];
export default function ShaiZiCanvas(props: {
    cishu: number;
}): JSX.Element {
    // Use useRef hook to access the canvas element
    const canvas = useRef<HTMLCanvasElement>();
    useEffect(() => {
        canvas.current.setAttribute("height", "200");
    }); // 用ifBrowser的话此时canvas.current还没初始化，不行
    return (
        <Canvas style={{
            cursor: "pointer"
        }} ref={canvas}>
            <ambientLight position={[ambientLightPosition, ambientLightPosition, ambientLightPosition]} />
            <Cube cishu={props.cishu} />
        </Canvas>
    );
}
