"use client";
import {
    Box,
    FormGroup,
    Grid,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {
    useTheme
} from "@mui/material/styles";
import drawMatrix, {
    block
} from "@verkfi/shared/matrix/matrix";
import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    throttle
} from "throttle-debounce";
import Cylinder from "./makeCylinder";
/**
 * 1000(ms, = 1s) / 60(60fps) = 17(ms)
 */
const throttleTime = 17;
function CylinderPage(): JSX.Element {
    const [radiusX, setRadiusX] = useState<number>(50),
        [radiusZ, setRadiusZ] = useState<number>(50),
        [thickness, setThickness] = useState<number>(1),
        [filled, setFilled] = useState<boolean>(true),
        [posX, setPosX] = useState<number>(1),
        [posZ, setPosZ] = useState<number>(1),
        radiusXID = useId(),
        radiusZID = useId(),
        thicknessID = useId(),
        theme = useTheme(),
        posCache = useRef<block>([1, 1]),
        cache = useRef<block[]>([]),
        blocks = useMemo(() => new Cylinder(radiusX, radiusZ, thickness, filled), [radiusX, radiusZ, thickness, filled]),
        updatePos = throttle(throttleTime, (X: number, Z: number) => {
            drawMatrix(blocks.slice(0), Math.max(radiusX, radiusZ), X, Z, posCache.current, cache.current, theme.palette, true);
            posCache.current = [X, Z];
            cache.current = blocks.slice(0);
        });
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
                        <Typography gutterBottom id={radiusXID}>
                            {get("cylinder.上下半径")}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField aria-labelledby={radiusXID} value={radiusX} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: "numeric"
                        }} onChange={event => setRadiusX(Number(event.target.value))} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography gutterBottom id={radiusZID}>
                            {get("cylinder.左右半径")}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField aria-labelledby={radiusZID} value={radiusZ} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: "numeric"
                        }} onChange={event => setRadiusZ(Number(event.target.value))} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography gutterBottom id={thicknessID}>
                            {get("cylinder.线条厚度")}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField aria-labelledby={thicknessID} value={thickness} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: "numeric"
                        }} onChange={event => setThickness(Number(event.target.value))} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography gutterBottom>
                            {get("cylinder.填充（线条厚度为0时填满圆心）")}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Switch value={filled} onChange={event => setFilled(event.target.checked)} />
                    </Grid>
                </Grid>
                <Grid direction="row" container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography gutterBottom>
                            {get("cylinder.位置")}
                        </Typography>
                    </Grid>
                    <Grid item container spacing={1}>
                        <TextField label="X" value={posX} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: "numeric"
                        }} onChange={event => {
                            const value = Number(event.target.value);
                            setPosX(value);
                            updatePos(value, posZ);
                        }} />
                        <TextField label="Y" value={posZ} type="number" InputLabelProps={{
                            shrink: true,
                            inputMode: "numeric"
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
export default CylinderPage;
