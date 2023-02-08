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
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import HeadBar from "../../components/HeadBar";
import {
    realTools as tools
} from "..";
import style from "../../styles/Filter.module.scss";
import {
    Grid,
    Input as MuiInput,
    Slider,
    Typography,
    Checkbox,
    FormControlLabel,
    FormGroup
} from "@mui/material";
import {
    styled
} from '@mui/material/styles';
import LpLogger from "lp-logger";
import {
    destroyer
} from "./reversal";
export var logger = new LpLogger({
    name: "滤镜",
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
export const emptyArray = [];
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
                onupdatefiles={images => {
                    setImageArray(images);
                    setImageFileName(images[0].filenameWithoutExtension);
                    setImageFileExtension(images[0].fileExtension);
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
                labelIdle='拖拽图片到这里、粘贴或<span class="filepond--label-action">浏览</span>'
            />
            <>
                <Typography gutterBottom>
                    滤镜类型
                </Typography>
                <FormGroup>
                    <FormControlLabel label="全部" control={
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