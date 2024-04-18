"use client";
import {
    Canvas
} from "@react-three/fiber";
import {
    Stats,
    OrbitControls
} from '@react-three/drei'
import {
    useRef, useState
} from "react";
import {
    BoxGeometry,
    Camera,
    CanvasTexture,
    Mesh,
    MeshPhongMaterial
} from "three";
import getTextCanvas from "./getTextCanvas";
export default function Cubic(): JSX.Element {
    const canvas = useRef<HTMLCanvasElement>(),
        camera = useRef<Camera>(),
        mesh = useRef<Mesh>(),
        [text, setText] = useState<[string, string, string, string, string, string]>(["A", "B", "C", "D", "E", "F"]),
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
        </>
    );
};
