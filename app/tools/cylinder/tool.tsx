import I18N from 'react-intl-universal';
import {
    useEffect,
    useState
} from "react";
import style from "./Cylinder.module.scss"
import removeIn2 from '../../components/removeIn';
import LpLogger from "lp-logger";
import makeCylinder from "./makeCylinder";
import drawCanvasBase from "./drawCanvasBase";
import {
    Typography,
    Grid,
    TextField,
    FormGroup,
    Switch
} from "@mui/material";
import {
    block
} from './drawCanvasBase';
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
    const drawCanvas = (blocks: block[]) => {
        var g = radiusX > radiusZ ? radiusX : radiusZ,
            b = document.body,
            w = b.scrollWidth - 48,
            h = b.scrollHeight - 48,
            e = w > h ? h : w,
            nowPos = [posX, posZ],
            cachePosBlock: block[] = [],
            posBlock: block[] = [];
        [nowPos, posCache].forEach((item, index) => ["X", "Z"].forEach((item2, index2) => {
            let i: number = 0;
            while (i < g * 2) {
                let block: block = index2 == 0 ? [i, item[index2] - 1] : [item[index2] - 1, i];
                index == 0 ? posBlock.push(block) : cachePosBlock.push(block);
                i++;
            }
        }));
        posBlock = removeIn2(posBlock, blocks) as block[];
        cachePosBlock = removeIn2(cachePosBlock, blocks) as block[];
        drawCanvasBase(e, g * 2 + 1, blocks, cache, posBlock, cachePosBlock);
    };
    useEffect(() => {
        const blocks = makeCylinder(radiusX, radiusZ, 1, thickness, filled);
        drawCanvas(blocks.slice(0));
        setCache(blocks.slice(0));
        setPosCache([posX, posZ]);
    }, [posX, posZ]);
    useEffect(() => {
        const g = radiusX > radiusZ ? radiusX : radiusZ,
            blocks = makeCylinder(radiusX, radiusZ, 1, thickness, filled);
        setPosX(g);
        setPosZ(g);
        drawCanvas(blocks.slice(0));
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
