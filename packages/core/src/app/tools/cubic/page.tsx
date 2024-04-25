"use client";
import {
    Canvas
} from "@react-three/fiber";
import {
    Stats,
    OrbitControls
} from '@react-three/drei'
import {
    useRef,
    useState
} from "react";
import {
    BoxGeometry,
    Camera,
    CanvasTexture,
    Mesh,
    MeshPhongMaterial
} from "three";
import getTextCanvas from "./getTextCanvas";
import {
    FormGroup,
    TextField
} from "@mui/material";
import {
    get
} from "react-intl-universal";
type text = [string, string, string, string, string, string];
export default function Cubic(): JSX.Element {
    const canvas = useRef<HTMLCanvasElement>(),
        camera = useRef<Camera>(),
        mesh = useRef<Mesh>(),
        [text, setText] = useState<text>(["A", "B", "C", "D", "E", "F"]),
        materials = [1, 2, 3, 4, 5, 6].map((item, index) => new MeshPhongMaterial({
            map: new CanvasTexture(getTextCanvas(text[index])),
            color: 0xffffff
        })),
        cube = new BoxGeometry(3, 3, 3);
    return (
        <>
            <Canvas ref={canvas}>
                <ambientLight position={[9, 9, 9]} />
                <camera ref={camera} position={[10, 10, 10]} />
                <mesh ref={mesh} args={[cube, materials]}>
                </mesh>
                <OrbitControls />
                <Stats />
            </Canvas>
            <FormGroup>
                {text.map((a, index) => (
                    <TextField value={a} margin="dense" label={get("cubic.face", {
                        face: index + 1
                    })} fullWidth onChange={event => {
                        setText(old => old.map((value, searchingIndex) => {
                            if (searchingIndex === index) {
                                return event.target.value;
                            }
                            return value;
                        }) as text);
                    }} />
                ))}
            </FormGroup>
        </>
    );
};
