import * as React from "react";
import {
    useState,
    useEffect
} from "react";
import {
    FilePond,
    registerPlugin
} from 'react-filepond'; // Import React FilePond
import FilePondPluginFileRename from 'filepond-plugin-file-rename'; // Import the plugin code
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'; // Import the plugin code
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'; // Import the plugin styles
import FilePondPluginImageResize from 'filepond-plugin-image-resize'; // Import the plugin code
import FilePondPluginImageEdit from 'filepond-plugin-image-edit'; // Import the plugin code
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css'; // Import the plugin styles
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'; // Import the plugin code
import {
    FilePondFile
} from "filepond";
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import HeadBar from "../../components/HeadBar";
import {
    tools
} from "..";
import style from "../../styles/Filter.module.scss";
import {
    Grid,
    Input as MuiInput,
    Slider,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Paper
} from "@mui/material";
import { styled } from '@mui/material/styles';
export var logger = log4js.getLogger("Filter");
declare global {
    interface Window {
        imageArray: any[];
    }
};
export const Input = styled(MuiInput)`
  width: 42px;
`;
export type ImageType = "blur" | "brightness" | "contrast" | "grayscale" | "huerotate" | "invert" | "opacity" | "saturate" | "sepia" | "shadow";
export const ImageTypesGen: ImageType[] = [
    "blur",
    "brightness",
    "contrast",
    "grayscale",
    "huerotate",
    "invert",
    "opacity",
    "saturate",
    "sepia",
    "shadow"
];
export const not = (a: ImageType[], b: ImageType[]) => a.filter((value) => b.indexOf(value) === -1);
export const intersection = (a: ImageType[], b: ImageType[]) => a.filter((value) => b.indexOf(value) !== -1);
export default function Filter(): JSX.Element {
    var [imageArray, setImageArray] = useState<any[]>([]);
    var [imageFileName, setImageFileName] = useState<string>("");
    var [imageFileExtension, setImageFileExtension] = useState<string>("");
    var [imageBase64, setImageBase64] = useState<string>("/libear-only.png");
    var [imageTypes, setImageTypes] = useState<ImageType[]>(ImageTypesGen);
    var [scale, setScale] = React.useState<number | string | Array<number | string>>(100);
    const handleSliderChange = (event: Event, newValue: number | number[]) => setScale(newValue);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setScale(event.target.value === '' ? '' : Number(event.target.value));
    const handleBlur = () => {
        if (scale < 0) {
            setScale(0);
        } else if (scale > 200) {
            setScale(200);
        }
    };
    var [checked, setChecked] = React.useState<ImageType[]>([]);
    var [right, setRight] = React.useState<ImageType[]>([]);
    const leftChecked = intersection(checked, imageTypes);
    const rightChecked = intersection(checked, right);
    const handleToggle = (value: ImageType) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };
    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setImageTypes(not(imageTypes, leftChecked));
        setChecked(not(checked, leftChecked));
    };
    function handleCheckedLeft() {
        setImageTypes(imageTypes.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    }
    const customList = (items: ImageType[]) => (
        <Paper sx={{ overflow: "auto" }}>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value}-label`;
                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                            style={{
                                backgroundColor: (checked.find(() => value) === value) ? "#1e9fff" : "#fff"
                            }}
                        >
                            <ListItemText id={labelId} primary={value} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );
    registerPlugin(FilePondPluginFileRename, FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageEdit, FilePondPluginImageCrop); // Register the plugin
    useEffect(function () {
        window.imageArray = imageArray;
    }, [imageArray]);
    return (
        <>
            <HeadBar isIndex={false} pageName={tools[6].name} />
            <br />
            <FilePond
                files={imageArray}
                onupdatefiles={(images: FilePondFile[]) => {
                    setImageArray(images);
                    setImageFileName(images[0].filenameWithoutExtension);
                    setImageFileExtension(images[0].fileExtension);
                    var reader = new FileReader();
                    reader.onload = function () {
                        setImageBase64(String(reader.result));
                        logger.info("已加载图片。");
                    };
                    reader.readAsDataURL(images[0].file);
                }}
                allowMultiple={true}
                maxFiles={1}
                name="files"
                labelIdle='拖拽图片到这里、粘贴或<span class="filepond--label-action">浏览</span>'
            />
            <>
                <Typography gutterBottom>
                    滤镜类型
                </Typography>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item>{customList(imageTypes)}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedRight}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedLeft}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>{customList(right)}</Grid>
                </Grid>
            </>
            <>
                <Typography id="input-slider" gutterBottom>
                    图片大小
                </Typography>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Slider
                            value={typeof scale === 'number' ? scale : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            value={scale}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 10,
                                min: 0,
                                max: 200,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography>%</Typography>
                    </Grid>
                </Grid>
            </>
            <div id="images" className={style["container"]}>
                {imageTypes.map((type) => <img title={type} key={type} className={style[type]} src={imageBase64} alt={type} style={{
                    transform: `scale(${(Number(scale) / 100).toString()})`
                }} />)}
            </div>
        </>
    );
};