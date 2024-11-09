import {
    useFrame
} from "@react-three/fiber";
import {
    useRef
} from "react";
import {
    BoxGeometry,
    Camera,
    Mesh,
    MeshPhongMaterial,
    TextureLoader
} from "three";
import img1 from "./image/1.svg";
import img2 from "./image/2.svg";
import img3 from "./image/3.svg";
import img4 from "./image/4.svg";
import img5 from "./image/5.svg";
import img6 from "./image/6.svg";
import {
    rotateAxis,
    rotateStep,
    randomAxis
} from "./shaiziCanvas";
import range from "@verkfi/shared/range";
import {
    cameraPosition,
    cubeSize
} from "@verkfi/tool-cubic/page";
export default function Cube(props: {
    cishu: number;
}) {
    const camera = useRef<Camera>(new Camera()),
        mesh = useRef<Mesh>(new Mesh()),
        stage = useRef<rotateAxis[]>([]),
        cacheStage = useRef<rotateAxis[]>([]),
        cishu = useRef(0),
        materials = [img1, img2, img3, img4, img5, img6].map((img: string) => new MeshPhongMaterial({
            map: new TextureLoader().load(img),
            color: 16777215
        })),
        cube = new BoxGeometry(cubeSize, cubeSize, cubeSize);
    useFrame(() => {
        // 它工作了，但不知道为什么
        // eslint-disable-next-line no-magic-numbers
        if (stage.current.length !== 0 && cishu.current < rotateStep / 2) {
            mesh.current.rotation[stage.current[stage.current.length - 1]] += Math.PI / rotateStep;
            cishu.current = cishu.current + 1;
        } else {
            cishu.current = 0;
            /**
             * `slice(0, -1)`可以用来代替`pop()`
             * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/pop#%E8%AF%AD%E6%B3%95
             */
            stage.current = stage.current.slice(0, -1);
        }
    });
    return (
        <>
            <camera ref={camera} position={[cameraPosition, cameraPosition, cameraPosition]} />
            <mesh ref={mesh} args={[cube, materials]} onClick={event => {
                if (stage.current.length === 0) {
                    const oldStage = range(props.cishu - 1).map(() => randomAxis()).toArray();
                    cacheStage.current = oldStage;
                    stage.current = oldStage;
                }
            }}>
            </mesh>
        </>
    );
}
