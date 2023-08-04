import I18N from 'react-intl-universal';
import {
    useEffect,
    useState
} from "react";
import style from "../styles/Cylinder.module.scss"
import LpLogger from "lp-logger";
import makeCylinder from "./cylinder/makeCylinder";
import drawCanvasBase from "./cylinder/drawCanvasBase";
import {
    Typography,
    Grid,
    TextField,
    FormGroup,
    Switch
} from "@mui/material";
export var logger = new LpLogger({
    name: I18N.get('画圆'),
    level: "log"
});
declare global {  //设置全局属性
    interface Window {  //window对象属性
        drawCanvas(
            radiusX: number,
            radiusZ: number,
            thickness: number,
            filled: boolean,
            size: number
        ): void;
    }
}
export function Cylinder(): JSX.Element {
    var [radiusX, setRadiusX] = useState<number>(50),
        [radiusZ, setRadiusZ] = useState<number>(50),
        [thickness, setThickness] = useState<number>(1),
        [filled, setFilled] = useState<boolean>(true),
        [posX, setPosX] = useState<number>(0),
        [posZ, setPosZ] = useState<number>(0);
    const drawCanvas = () => {
        var g = radiusX > radiusZ ? radiusX : radiusZ,
            b = document.body,
            w = b.scrollWidth - 48,
            h = b.scrollHeight - 48,
            c = document.getElementById("canvascontainer"),
            e = w > h ? h : w;
        c.innerHTML = "";
        c.appendChild(drawCanvasBase(e, g * 2, makeCylinder(radiusX, radiusZ, 1, thickness, filled)));
    };
    useEffect(() => {
        window.drawCanvas = drawCanvas;
    }, []);
    useEffect(drawCanvas, [radiusX, radiusZ, thickness, filled]);
    return (
        <>
            <FormGroup>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="radiusX" gutterBottom>
                            {I18N.get('上下半径')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField value={radiusX} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: 'numeric',
                            'aria-labelledby': 'radiusX',
                        }} onChange={event => setRadiusX(Number(event.target.value))} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="radiusZ" gutterBottom>
                            {I18N.get('左右半径')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField value={radiusZ} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: 'numeric',
                            'aria-labelledby': 'radiusZ',
                        }} onChange={event => setRadiusZ(Number(event.target.value))} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="thickness" gutterBottom>
                            {I18N.get('线条厚度')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField value={thickness} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: 'numeric',
                            'aria-labelledby': 'thickness',
                        }} onChange={event => setThickness(Number(event.target.value))} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="filled" gutterBottom>
                            {I18N.get('填充（线条厚度为0时填满圆心）')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Switch value={filled} onChange={event => setFilled(event.target.checked)} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="position" gutterBottom>
                            {I18N.get('鼠标所在的位置')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom>
                            X：{posX} Y：{posZ}
                        </Typography>
                    </Grid>
                </Grid>
            </FormGroup>
            <div id="canvascontainer" onMouseMove={event => {
                const b = document.body,
                    w = b.scrollWidth - 48,
                    h = b.scrollHeight - 48,
                    e = w > h ? h : w,
                    x = parseInt(String(event.clientX / (e / radiusX))),
                    z = parseInt(String(event.clientY / (e / radiusZ)));
                setPosX(x);
                setPosZ(z);
            }}>
                <canvas id="canvas" width={1} height={1} />
            </div>
        </>
    );
}
export default Cylinder;