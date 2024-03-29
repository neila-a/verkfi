"use client";
import {
    get
} from 'react-intl-universal';
import {
    useEffect,
    useState,
    useMemo,
    useRef
} from "react";
import LpLogger from "lp-logger";
import makeCylinder from "./makeCylinder";
import {
    Typography,
    Grid,
    TextField,
    FormGroup,
    Switch,
    Box
} from "@mui/material";
import throttle from '../../components/throttle';
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
        theme = useTheme(),
        posCache = useRef<block>([1, 1]),
        cache = useRef<block[]>([]),
        blocks = useMemo(() => makeCylinder(radiusX, radiusZ, thickness, filled), [radiusX, radiusZ, thickness, filled]),
        updatePos = throttle((X: number, Z: number) => {
            drawMatrix(blocks.slice(0), Math.max(radiusX, radiusZ), X, Z, posCache.current, cache.current, theme.palette, true);
            posCache.current = [X, Z];
            cache.current = blocks.slice(0);
        }, 17 /* 1000(ms, = 1s) / 60(60fps) = 17(ms) */);
    useEffect(() => {
        const g = Math.max(radiusX, radiusZ);
        drawMatrix(blocks.slice(0), g, g, g, posCache.current, cache.current, theme.palette, false);
        posCache.current = [g, g];
        cache.current = blocks.slice(0);
    }, [radiusX, radiusZ, thickness, filled]);
    return (
        <>
            <FormGroup>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="radiusX" gutterBottom>
                            {get('cylinder.上下半径')}
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
                            {get('cylinder.左右半径')}
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
                            {get('cylinder.线条厚度')}
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
                            {get('cylinder.填充（线条厚度为0时填满圆心）')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Switch value={filled} onChange={event => setFilled(event.target.checked)} />
                    </Grid>
                </Grid>
                <Grid direction="row" container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="position" gutterBottom>
                            {get('cylinder.位置')}
                        </Typography>
                    </Grid>
                    <Grid item container spacing={1}>
                        <TextField label="X" value={posX} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: 'numeric'
                        }} onChange={event => {
                            const value = Number(event.target.value);
                            setPosX(value);
                            updatePos(value, posZ);
                        }} />
                        <TextField label="Y" value={posZ} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: 'numeric'
                        }} onChange={event => {
                            const value = Number(event.target.value);
                            setPosZ(value);
                            updatePos(posZ, value);
                        }} />
                    </Grid>
                </Grid>
            </FormGroup>
            <Box id="canvascontainer" sx={{
                cursor: "cell"
            }} onMouseMove={event => {
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
                updatePos(x, z);
            }}>
                <canvas id="canvas" width={1} height={1} />
            </Box>
        </>
    );
}
export default Cylinder;
