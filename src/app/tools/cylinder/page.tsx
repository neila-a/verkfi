"use client";
import I18N from 'react-intl-universal';
import {
    useEffect,
    useState
} from "react";
import style from "./Cylinder.module.scss"
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
export var logger = new LpLogger({
    name: I18N.get('画圆'),
    level: "log"
});
export function Cylinder(): JSX.Element {
    var [radiusX, setRadiusX] = useState<number>(50),
        [radiusZ, setRadiusZ] = useState<number>(50),
        [thickness, setThickness] = useState<number>(1),
        [filled, setFilled] = useState<boolean>(true),
        [posX, setPosX] = useState<number>(1),
        [posZ, setPosZ] = useState<number>(1),
        [cache, setCache] = useState<block[]>([[1, 1]]),
        [posCache, setPosCache] = useState<block>([1, 1]);
    const theme = useTheme();
    useEffect(() => {
        const blocks = makeCylinder(radiusX, radiusZ, thickness, filled);
        drawMatrix(blocks.slice(0), Math.max(radiusX, radiusZ), posX, posZ, posCache, cache, theme.palette.mode);
        setCache(blocks.slice(0));
        setPosCache([posX, posZ]);
    }, [posX, posZ]);
    useEffect(() => {
        const g = Math.max(radiusX, radiusZ),
            blocks = makeCylinder(radiusX, radiusZ, thickness, filled);
        setPosX(g);
        setPosZ(g);
        drawMatrix(blocks.slice(0), Math.max(radiusX, radiusZ), posX, posZ, posCache, cache, theme.palette.mode);
        setCache(blocks.slice(0));
        setPosCache([posX, posZ]);
    }, [radiusX, radiusZ, thickness, filled]);
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
            </FormGroup>
            <Grid container spacing={1} alignItems="center" sx={{
                zIndex: 386486,
                position: "sticky",
                top: "64px"
            }}>
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
            <div id="canvascontainer" onMouseMove={event => {
                const b = document.body,
                    w = b.scrollWidth - 48,
                    h = b.scrollHeight - 48,
                    e = w > h ? h : w,
                    x = parseInt(String(event.nativeEvent.offsetX / (e / radiusX) * 2 + 1)),
                    z = parseInt(String(event.nativeEvent.offsetY / (e / radiusZ) * 2 + 1));
                setPosX(x);
                setPosZ(z);
            }}>
                <canvas id="canvas" width={1} height={1} />
            </div>
        </>
    );
}
export default Cylinder;
