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
    block,
    dDivR
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
const throttleTime = 17,
    initialRadius = 50;
function CylinderPage() {
    const [radiusX, setRadiusX] = useState(initialRadius),
        [radiusZ, setRadiusZ] = useState(initialRadius),
        [thickness, setThickness] = useState(1),
        [filled, setFilled] = useState(true),
        [posX, setPosX] = useState(1),
        [posZ, setPosZ] = useState(1),
        radiusXID = useId(),
        radiusZID = useId(),
        thicknessID = useId(),
        theme = useTheme(),
        posCache = useRef<block>([1, 1]),
        blocks = useMemo(() => new Cylinder(radiusX, radiusZ, thickness, filled), [radiusX, radiusZ, thickness, filled]),
        updatePos = throttle(throttleTime, (X: number, Z: number) => {
            drawMatrix(blocks.slice(0), Math.max(radiusX, radiusZ), X, Z, posCache.current, theme.palette, true);
            posCache.current = [X, Z];
        });
    useEffect(() => {
        const g = Math.max(radiusX, radiusZ);
        drawMatrix(blocks.slice(0), g, g, g, posCache.current, theme.palette, false);
        posCache.current = [g, g];
    }, [radiusX, radiusZ, thickness, filled, blocks, theme.palette]);
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
                        <TextField aria-labelledby={radiusXID} value={radiusX} type="number" slotProps={{
                            inputLabel: {
                                shrink: true,
                                inputMode: "numeric"
                            }
                        }} onChange={event => setRadiusX(+event.target.value)} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography gutterBottom id={radiusZID}>
                            {get("cylinder.左右半径")}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField aria-labelledby={radiusZID} value={radiusZ} type="number" slotProps={{
                            inputLabel: {
                                shrink: true,
                                inputMode: "numeric"
                            }
                        }} onChange={event => setRadiusZ(+event.target.value)} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography gutterBottom id={thicknessID}>
                            {get("cylinder.线条厚度")}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField aria-labelledby={thicknessID} value={thickness} type="number" slotProps={{
                            inputLabel: {
                                shrink: true,
                                inputMode: "numeric"
                            }
                        }} onChange={event => setThickness(+event.target.value)} />
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
                        <TextField label="X" value={posX} type="number" slotProps={{
                            inputLabel: {
                                shrink: true,
                                inputMode: "numeric"
                            }
                        }} onChange={event => {
                            const value = +event.target.value;
                            setPosX(value);
                            updatePos(value, posZ);
                        }} />
                        <TextField label="Y" value={posZ} type="number" slotProps={{
                            inputLabel: {
                                shrink: true,
                                inputMode: "numeric"
                            }
                        }} onChange={event => {
                            const value = +event.target.value;
                            setPosZ(value);
                            updatePos(posZ, value);
                        }} />
                    </Grid>
                </Grid>
            </FormGroup>
            <Box id="canvascontainer" sx={{
                cursor: "cell"
            }} onMouseMove={event => {
                const style = window.getComputedStyle(document.getElementById("canvascontainer") as HTMLCanvasElement),
                    width = +style.width.replace("px", ""),
                    height = +style.height.replace("px", ""),
                    edge = Math.min(height, width),
                    x = Math.round(event.nativeEvent.offsetX / (edge / radiusX) * dDivR + 1),
                    z = Math.round(event.nativeEvent.offsetY / (edge / radiusZ) * dDivR + 1);
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
