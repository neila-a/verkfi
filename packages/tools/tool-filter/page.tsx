"use client";
import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    ImageList,
    Input as MuiInput,
    Slider,
    Typography
} from "@mui/material";
import No from "@verkfi/shared/No";
import {
    FilePondFile,
    FilePondServerConfigProps
} from "filepond";
import {
    ChangeEvent,
    useId,
    useState
} from "react";
import {
    FilePond
} from "react-filepond"; // Import React FilePond
import {
    get
} from "react-intl-universal";
import removeArrayItem from "remove-item-from-array";
import ImageTypesGen, {
    ImageType
} from "./consts";
import SingleImage from "./singleImage";
import libearOnly from "./image/libear-only.png";
import useBlobState from "@verkfi/shared/useBlobState";
const initialScale = 100,
    scaleMax = 200;
export default function Filter() {
    const [imageArray, setImageArray] = useState<FilePondFile[]>([]),
        [imageFileName, setImageFileName] = useState("libear-only"),
        [imageURL, setImageURL] = useBlobState(libearOnly.src),
        [imageTypes, setImageTypes] = useState<ImageType[]>(ImageTypesGen),
        [scale, setScale] = useState(initialScale),
        sizeId = useId(),
        handleSliderChange = (event: Event, newValue: number | number[]) => setScale(Number(newValue)),
        handleInputChange = (event: ChangeEvent<HTMLInputElement>) => setScale(Number(event.target.value));
    function handleBlur() {
        if (scale < 0) {
            setScale(0);
        } else if (scale > scaleMax) {
            setScale(scaleMax);
        }
    }
    return (
        <>
            <FilePond
                files={imageArray as unknown as FilePondServerConfigProps["files"]}
                onupdatefiles={images => {
                    setImageArray(images);
                    images.forEach(image => {
                        setImageFileName(image.filename);
                        setImageURL(image.file);
                    });
                }}
                maxFiles={1}
                acceptedFileTypes={["image/*"]}
                name="files"
                labelIdle={get("drag.拖拽图片到这里")}
            />
            <Box component="section">
                <Typography gutterBottom>
                    {get("滤镜类型")}
                </Typography>
                <FormGroup sx={{
                    display: "block"
                }}>
                    <FormControlLabel label={get("全部")} control={
                        <Checkbox
                            checked={imageTypes === ImageTypesGen}
                            indeterminate={imageTypes !== ImageTypesGen && imageTypes.toString() !== ""}
                            onChange={event => setImageTypes(event.target.checked ? ImageTypesGen : [])}
                        />
                    } />
                    {ImageTypesGen.map(type => <FormControlLabel control={
                        <Checkbox defaultChecked checked={imageTypes.includes(type)} onChange={event => {
                            setImageTypes(event.target.checked ? [...imageTypes, type] : removeArrayItem(imageTypes, type));
                        }} />
                    } label={type} key={type} />)}
                </FormGroup>
            </Box>
            <Box component="section">
                <Typography id={sizeId} gutterBottom>
                    {get("图片大小")}
                </Typography>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Slider
                            value={typeof scale === "number" ? scale : 0}
                            onChange={handleSliderChange}
                            aria-labelledby={sizeId}
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
                                type: "number",
                                "aria-labelledby": sizeId
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography>
                            %
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            {imageTypes.length === 0 ? <No>
                {get("filter.没有任何已生成的图片")}
            </No> : <ImageList>
                {imageTypes.map(type => <SingleImage scale={scale} imageURL={imageURL} imageFileName={imageFileName} type={type} key={type} />
                )}
            </ImageList>}
        </>
    );
}
