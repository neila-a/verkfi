"use client";
import {
    get
} from 'react-intl-universal';
import * as React from "react";
import {
    useState
} from "react";
import domtoimage from 'dom-to-image';
import {
    saveAs
} from 'file-saver';
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
import style from "./Filter.module.scss";
import {
    Grid,
    Input as MuiInput,
    Slider,
    Typography,
    Checkbox,
    FormControlLabel,
    FormGroup,
    ImageList,
    ImageListItem,
    Box,
    ImageListItemBar
} from "@mui/material";
import {
    styled
} from '@mui/material/styles';
import LpLogger from "lp-logger";
import {
    SyncProblem as SyncProblemIcon
} from '@mui/icons-material';
import destroyer from "../../components/destroyer";
var logger = new LpLogger({
    name: get('滤镜'),
    level: "log", // 空字符串时，不显示任何信息
});
const Input = styled(MuiInput)`
  width: 42px;
`;
import {
    ImageType,
    ImageTypesGen
} from "./consts";
import {
    FilePondFile,
    FilePondServerConfigProps
} from 'filepond';
export default function Filter(): JSX.Element {
    const [imageArray, setImageArray] = useState<FilePondFile[]>([]),
        [imageFileName, setImageFileName] = useState<string>("libear-only"),
        [imageBase64, setImageBase64] = useState<string>("/image/libear-only.png"),
        [imageTypes, setImageTypes] = useState<ImageType[]>(ImageTypesGen),
        [scale, setScale] = useState<number>(100),
        handleSliderChange = (event: Event, newValue: number) => setScale(newValue),
        handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setScale(Number(event.target.value)),
        handleBlur = () => {
            if (scale < 0) {
                setScale(0);
            } else if (scale > 200) {
                setScale(200);
            }
        };
    registerPlugin(FilePondPluginFileRename, FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageEdit, FilePondPluginImageCrop); // Register the plugin
    return (
        <>
            <FilePond
                files={imageArray as unknown as FilePondServerConfigProps["files"]}
                onupdatefiles={images => {
                    setImageArray(images);
                    setImageFileName(images[0].filenameWithoutExtension);
                    var reader = new FileReader();
                    reader.onload = function () {
                        setImageBase64(String(reader.result));
                        logger.log(`已加载图片${images[0].filename}。`);
                    };
                    reader.readAsDataURL(images[0].file);
                }}
                allowMultiple={true}
                maxFiles={1}
                name="files"
                labelIdle={get('drag.拖拽图片到这里')}
            />
            <>
                <Typography gutterBottom>
                    {get('滤镜类型')}
                </Typography>
                <FormGroup sx={{
                    display: "block"
                }}>
                    <FormControlLabel label={get('全部')} control={
                        <Checkbox
                            checked={imageTypes == ImageTypesGen}
                            indeterminate={(imageTypes != ImageTypesGen) && (imageTypes.toString() !== "")}
                            onChange={event => {
                                switch (event.target.checked) {
                                    case true:
                                        setImageTypes(ImageTypesGen);
                                        break;
                                    case false:
                                        setImageTypes([]);
                                        break;
                                }
                            }}
                        />
                    } />
                    {ImageTypesGen.map(type => <FormControlLabel control={
                        <Checkbox defaultChecked checked={imageTypes.includes(type)} onChange={event => {
                            switch (event.target.checked) {
                                case true:
                                    setImageTypes([...imageTypes, type]);
                                    break;
                                case false:
                                    setImageTypes(destroyer(imageTypes, type));
                                    break;
                            }
                        }} />
                    } label={type} key={type} />)}
                </FormGroup>
            </>
            <>
                <Typography id="input-slider" gutterBottom>
                    {get('图片大小')}
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
            {imageTypes.length === 0 ? <Box sx={{
                color: theme => theme.palette.text.disabled,
                textAlign: "center"
            }}>
                <SyncProblemIcon sx={{
                    fontSize: "500%"
                }} />
                <Typography>
                    {get("filter.没有任何已生成的图片")}
                </Typography>
            </Box> : <ImageList>
                {imageTypes.map((type) => (
                    <ImageListItem key={type} component="figure">
                        <img title={type} key={type} className={`${style[type]} ${style["image"]}`} src={imageBase64} id={type} alt={type} style={{
                            transform: `scale(${(Number(scale) / 100).toString()})`
                        }} onClick={event => {
                            domtoimage.toBlob(document.getElementById(type)).then((blob: Blob) => {
                                // 调用file-save方法 直接保存图片
                                saveAs(blob, `${imageFileName}.${type}.png`)
                            })
                        }} />
                        <Box component="figcaption">
                            <ImageListItemBar title={type} subtitle={imageFileName} />
                        </Box>
                    </ImageListItem>
                ))}
            </ImageList>}
        </>
    );
};
