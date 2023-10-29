"use client";
import {
    get
} from 'react-intl-universal';
import {
    useEffect,
    useState
} from "react";
import LpLogger from "lp-logger";
import makeCylinder from "./makeCylinder";
import {
    Typography,
    Grid,
    TextField,
    FormGroup,
    Switch
} from "@mui/material";
import {
    useTheme
} from '@mui/material/styles';
import drawMatrix, {
    block
} from '../../components/matrix/matrix';
var logger = new LpLogger({
    name: get('画圆'),
    level: "log"
});
function Cylinder(): JSX.Element {
    const [radiusX, setRadiusX] = useState<number>(50),
        [radiusZ, setRadiusZ] = useState<number>(50),
        [thickness, setThickness] = useState<number>(1),
        [filled, setFilled] = useState<boolean>(true),
        [posX, setPosX] = useState<number>(1),
        [posZ, setPosZ] = useState<number>(1),
        [cache, setCache] = useState<block[]>([[1, 1]]),
        [posCache, setPosCache] = useState<block>([1, 1]),
        theme = useTheme();
    useEffect(() => {
        const blocks = makeCylinder(radiusX, radiusZ, thickness, filled);
        setCache(blocks.slice(0));
        setPosCache([posX, posZ]);
        drawMatrix(blocks.slice(0), Math.max(radiusX, radiusZ), posX, posZ, posCache, cache, theme.palette);
    }, [posX, posZ]);
    useEffect(() => {
        const g = Math.max(radiusX, radiusZ),
            blocks = makeCylinder(radiusX, radiusZ, thickness, filled);
        setCache(blocks.slice(0));
        setPosCache([posX, posZ]);
        setPosX(g);
        setPosZ(g);
        drawMatrix(blocks.slice(0), Math.max(radiusX, radiusZ), posX, posZ, posCache, cache, theme.palette);
    }, [radiusX, radiusZ, thickness, filled]);
    return (
        <>
            <FormGroup>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="radiusX" gutterBottom>
                            {get('上下半径')}
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
                            {get('左右半径')}
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
                            {get('线条厚度')}
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
                            {get('填充（线条厚度为0时填满圆心）')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Switch value={filled} onChange={event => setFilled(event.target.checked)} />
                    </Grid>
                </Grid>
                <Grid direction="row" container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="position" gutterBottom>
                            {get('位置')}
                        </Typography>
                    </Grid>
                    <Grid item container spacing={1}>
                        <TextField label="X" value={posX} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: 'numeric'
                        }} onChange={event => setPosX(Number(event.target.value))} />
                        <TextField label="Y" value={posZ} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: 'numeric'
                        }} onChange={event => setPosZ(Number(event.target.value))} />
                    </Grid>
                </Grid>
            </FormGroup>
            <div id="canvascontainer" onMouseMove={event => {
                const b = window.getComputedStyle(document.getElementById("canvascontainer")),
                    w = Number(b.width.replace("px", "")),
                    h = Number(b.height.replace("px", "")),
                    e = Math.min(h, w),
                    x = Math.round(event.nativeEvent.offsetX / (e / radiusX) * 2 + 1),
                    z = Math.round(event.nativeEvent.offsetY / (e / radiusZ) * 2 + 1);
                if (posX !== x) {
                    setPosX(x);
                }
                if (posZ !== z) {
                    setPosZ(z);
                }
            }}>
                <canvas id="canvas" width={1} height={1} />
            </div>
        </>
    );
}
export default Cylinder;
