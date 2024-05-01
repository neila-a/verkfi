import {
    Canvas,
    useFrame
} from "@react-three/fiber";
import {
    useEffect,
    useRef
} from "react";
import {
    BoxGeometry,
    Camera,
    Mesh,
    MeshPhongMaterial,
    TextureLoader
} from "three";
type rotateAxis = "x" | "y" | "z";
const rotateAxis: rotateAxis[] = ["x", "y", "z"],
    rotateStep = 50, // 转90度所需要的帧
    randomAxis = () => rotateAxis[Math.floor(Math.random() * 3)];
function Cube(props: {
    cishu: number;
}) {
    const camera = useRef<Camera>(),
        mesh = useRef<Mesh>(),
        stage = useRef<rotateAxis[]>([]),
        cacheStage = useRef<rotateAxis[]>([]),
        cishu = useRef<number>(0),
        materials = [1, 2, 3, 4, 5, 6].map(item => new MeshPhongMaterial({
            map: new TextureLoader().load(`/image/shaizi/${item}.svg`),
            color: 0xffffff
        })),
        cube = new BoxGeometry(3, 3, 3);
    useFrame(() => {
        if (stage.current.length !== 0 && cishu.current < rotateStep / 2) {
            mesh.current.rotation[stage.current[stage.current.length - 1]] += Math.PI / rotateStep;
            cishu.current = cishu.current + 1;
        } else {
            cishu.current = 0;
            const oldStage = stage.current.slice(0);
            oldStage.pop();
            stage.current = oldStage;
        }
    });
    return (
        <>
            <camera ref={camera} position={[10, 10, 10]} />
            <mesh ref={mesh} args={[cube, materials]} onClick={event => {
                if (stage.current.length === 0) {
                    const oldStage = [];
                    while (oldStage.toString() === cacheStage.current.toString())
                    for (let step = 0; step < props.cishu; step++) {
                        oldStage.push(randomAxis());
                    }
                    if (oldStage.toString() === cacheStage.current.toString()) {
                        oldStage.splice(0, oldStage.length)
                        for (let step = 0; step < props.cishu; step++) {
                            oldStage.push(randomAxis());
                        }
                    } else {
                        cacheStage.current = oldStage;
                    }
                    stage.current = oldStage;
                }
            }}>
            </mesh>
        </>
    );
}
export function ShaiZiCanvas(props: {
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
            <ambientLight position={[9, 9, 9]} />
            <Cube cishu={props.cishu} />
        </Canvas>
    );
}
