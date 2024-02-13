import {
    Canvas,
    useFrame
} from "@react-three/fiber"
import {
    useEffect,
    useRef
} from "react";
import {
    setState
} from '../../declare';
import {
    BoxGeometry,
    Mesh,
    MeshPhongMaterial,
    TextureLoader
} from "three";
export function ShaiZiCanvas(props: {
    cishu: number;
    setCishu: setState<number>;
}): JSX.Element {
    // Use useRef hook to access the mesh element
    const mesh = useRef<Mesh>(),
        canvas = useRef<HTMLCanvasElement>(),
        material = new MeshPhongMaterial({
            map: new TextureLoader().load("/image/libear-only.png")
        }),
        cube = new BoxGeometry(4, 4, 4);
    useEffect(() => {
        canvas.current.setAttribute("height", "200");
    });
    return (
        <Canvas ref={canvas}>
            <ambientLight position={[9, 9, 9]} />
            <camera position={[10, 10, 10]} />
            <mesh ref={mesh} args={[cube, material]} onClick={event => {
                mesh.current.rotation.x += 0.5
                mesh.current.rotation.y += 0.5
                mesh.current.rotation.z += 0.5
            }}>
            </mesh>
        </Canvas>
    );
}
