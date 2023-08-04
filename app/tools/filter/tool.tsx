import I18N from 'react-intl-universal';
import * as React from "react";
import {
    useState,
    useEffect
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
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import style from "../styles/Filter.module.scss";
import {
    Grid,
    Input as MuiInput,
    Slider,
    Typography,
    Checkbox,
    FormControlLabel,
    FormGroup,
    ImageList,
    ImageListItem
} from "@mui/material";
import {
    styled
} from '@mui/material/styles';
import LpLogger from "lp-logger";
import destroyer from "../components/destroyer";
var logger = new LpLogger({
    name: I18N.get('滤镜'),
    level: "log", // 空字符串时，不显示任何信息
});
declare global {
    interface Window {
        imageArray: any[];
    }
};
export const Input = styled(MuiInput)`
  width: 42px;
`;
import {
    ImageType,
    ImageTypesGen
} from "./filter/consts";
export const emptyArray: [] = [];
export default function Filter(): JSX.Element {
    var [imageArray, setImageArray] = useState<any[]>([]);
    var [imageFileName, setImageFileName] = useState<string>("libear-only");
    var [imageBase64, setImageBase64] = useState<string>("/image/libear-only.png");
    var [imageTypes, setImageTypes] = useState<ImageType[]>(ImageTypesGen);
    var [scale, setScale] = useState<number>(100);
    const handleSliderChange = (event: Event, newValue: number) => setScale(newValue);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setScale(Number(event.target.value));
    const handleBlur = () => {
        if (scale < 0) {
            setScale(0);
        } else if (scale > 200) {
            setScale(200);
        }
    };
    registerPlugin(FilePondPluginFileRename, FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageEdit, FilePondPluginImageCrop); // Register the plugin
    useEffect(function () {
        window.imageArray = imageArray;
    }, [imageArray, imageFileName]);
    return (
        <>
            <br />
            <FilePond
                files={imageArray}
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
                labelIdle={I18N.get('拖拽图片到这里、粘贴或<span class=\"filepond--label-action\">浏览</span>')}
            />
            <>
                <Typography gutterBottom>
                    {I18N.get('滤镜类型')}
                </Typography>
                <FormGroup sx={{
                    display: "block"
                }}>
                    <FormControlLabel label={I18N.get('全部')} control={
                        <Checkbox
                            checked={imageTypes == ImageTypesGen}
                            indeterminate={(imageTypes != ImageTypesGen) && (imageTypes != emptyArray)}
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
                    {I18N.get('图片大小')}
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
            <ImageList>
                {imageTypes.map((type) => (
                    <ImageListItem key={type}>
                        <img title={type} key={type} className={`${style[type]} ${style["image"]}`} src={imageBase64} id={type} alt={type} style={{
                            transform: `scale(${(Number(scale) / 100).toString()})`
                        }} onClick={event => {
                            domtoimage.toBlob(document.getElementById(type)).then((blob: Blob) => {
                                // 调用file-save方法 直接保存图片
                                saveAs(blob, `${imageFileName}.${type}.png`)
                            })
                        }} />
                    </ImageListItem>
                ))}
            </ImageList>
        </>
    );
};