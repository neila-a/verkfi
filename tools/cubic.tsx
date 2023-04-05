import {
    useEffect
} from "react";
import * as Three from "three";
export function Cubic(): JSX.Element {
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const redMaterial = new Three.MeshBasicMaterial({
        color: 0xff0000
    });
    const twoGeometry = new Three.BoxGeometry(2, 2, 2);
    const twoRedCube = new Three.Mesh(twoGeometry, redMaterial);
    scene.add(twoRedCube);
    useEffect(function () {
        const renderer = new Three.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: document.getElementById("main")
        });
        renderer.render(scene, camera);
    }, [])
    return (
        <>
            <canvas id="main" />
        </>
    );
};
export default Cubic;