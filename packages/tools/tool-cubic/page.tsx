"use client";
import {
    FormGroup,
    TextField
} from "@mui/material";
import {
    OrbitControls,
    Stats
} from "@react-three/drei";
import {
    Canvas
} from "@react-three/fiber";
import {
    useRef,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    BoxGeometry,
    Camera,
    CanvasTexture,
    Mesh,
    MeshPhongMaterial
} from "three";
import getTextCanvas from "./getTextCanvas";
type text = [string, string, string, string, string, string];
export const cubeSize = 3,
    ambientLightPosition = 9,
    cameraPosition = 10;
export default function Cubic() {
    const canvas = useRef<HTMLCanvasElement>(),
        camera = useRef<Camera>(),
        mesh = useRef<Mesh>(),
        [text, setText] = useState<text>(["A", "B", "C", "D", "E", "F"]),
        // 这一行的魔数是正方体的六个面
        // eslint-disable-next-line no-magic-numbers
        materials = [1, 2, 3, 4, 5, 6].map((item, index) => new MeshPhongMaterial({
            map: new CanvasTexture(getTextCanvas(text[index])),
            color: 0xffffff
        })),
        cube = new BoxGeometry(cubeSize, cubeSize, cubeSize);
    return (
        <>
            <Canvas ref={canvas}>
                <ambientLight position={[ambientLightPosition, ambientLightPosition, ambientLightPosition]} />
                <camera ref={camera} position={[cameraPosition, cameraPosition, cameraPosition]} />
                <mesh ref={mesh} args={[cube, materials]}>
                </mesh>
                <OrbitControls />
                <Stats />
            </Canvas>
            <FormGroup>
                {text.map((a, index) => <TextField key={index} value={a} margin="dense" label={get("cubic.face", {
                    face: index + 1
                })} fullWidth onChange={event => {
                    setText(old => old.map((value, searchingIndex) => {
                        if (searchingIndex === index) {
                            return event.target.value;
                        }
                        return value;
                    }) as text);
                }} />
                )}
            </FormGroup>
        </>
    );
}
