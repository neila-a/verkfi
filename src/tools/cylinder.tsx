import I18N from 'react-intl-universal';
import {
    useEffect,
    useState
} from "react";
import style from "../styles/Cylinder.module.scss"
import LpLogger from "lp-logger";
import makeCylinder from "./cylinder/makeCylinder";
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
export function Cylinder(): JSX.Element {
    var [radiusX, setRadiusX] = useState<number>(50),
        [radiusZ, setRadiusZ] = useState<number>(50),
        [thickness, setThickness] = useState<number>(1),
        [filled, setFilled] = useState<boolean>(true),
        [posX, setPosX] = useState<number>(0),
        [posZ, setPosZ] = useState<number>(0),
        [edge, setEdge] = useState<number>(1);
    const drawCanvas = () => {
        const drawer = new Worker("/cylinderDrawCanvas.js");
        var g = radiusX > radiusZ ? radiusX : radiusZ,
            b = document.body,
            w = b.scrollWidth - 48,
            h = b.scrollHeight - 48,
            calcEdge = w > h ? h : w;
        setEdge(calcEdge);
        drawer.onmessage = event => {
        }
        try {
            drawer.postMessage([calcEdge, g * 2, makeCylinder(radiusX, radiusZ, 1, thickness, filled), document.getElementById("canvas").transferControlToOffscreen()]);
        } catch (error) {
            logger.error("无法移交canvas的控制权至离屏：", error);
        }
    };
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
                <canvas id="canvas" width={edge} height={edge} onMouseMove={event => {
                const b = document.body,
                    w = b.scrollWidth - 48,
                    h = b.scrollHeight - 48,
                    x = parseInt(String(event.clientX / (edge / radiusX))),
                    z = parseInt(String(event.clientY / (edge / radiusZ)));
                setPosX(x);
                setPosZ(z);
                }} />
        </>
    );
}
export default Cylinder;
