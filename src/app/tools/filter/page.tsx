"use client";
import {
    get
} from 'react-intl-universal';
import * as React from "react";
import {
    useState
} from "react";
import {
    FilePond
} from 'react-filepond'; // Import React FilePond
import {
    Grid,
    Input as MuiInput,
    Slider,
    Typography,
    Checkbox,
    FormControlLabel,
    FormGroup,
    ImageList,
    Box
} from "@mui/material";
import {
    SyncProblem as SyncProblemIcon
} from '@mui/icons-material';
import destroyer from "../../components/destroyer";
import {
    ImageType,
    ImageTypesGen
} from "./consts";
import {
    FilePondFile,
    FilePondServerConfigProps
} from 'filepond';
import SingleImage from './singleImage';
export default function Filter(): JSX.Element {
    const [imageArray, setImageArray] = useState<FilePondFile[]>([]),
        [imageFileName, setImageFileName] = useState<string>("libear-only"),
        [imageURL, setImageURL] = useState<string>("/image/libear-only.png"),
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
    return (
        <>
            <FilePond
                files={imageArray as unknown as FilePondServerConfigProps["files"]}
                onupdatefiles={images => {
                    setImageArray(images);
                    images.forEach(image => {
                        setImageFileName(image.filename);
                        setImageURL(URL.createObjectURL(image.file));
                    });
                }}
                maxFiles={1}
                acceptedFileTypes={["image/*"]}
                name="files"
                labelIdle={get('drag.拖拽图片到这里')}
            />
            <Box component="section">
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
                            onChange={event => setImageTypes(event.target.checked ? ImageTypesGen : [])}
                        />
                    } />
                    {ImageTypesGen.map(type => <FormControlLabel control={
                        <Checkbox defaultChecked checked={imageTypes.includes(type)} onChange={event => setImageTypes(event.target.checked ? [...imageTypes, type] : destroyer(imageTypes, type))} />
                    } label={type} key={type} />)}
                </FormGroup>
            </Box>
            <Box component="section">
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
                        <MuiInput
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
            </Box>
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
                {imageTypes.map(type => <SingleImage scale={scale} imageURL={imageURL} imageFileName={imageFileName} type={type} key={type} />)}
            </ImageList>}
        </>
    );
};
