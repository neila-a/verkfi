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
import HeadBar from "../components/HeadBar";
import {
    pages
} from "./index";
import imageStyle from "../styles/Filter.module.scss";
import {
    FormGroup,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import {
    destroyer
} from "./reversal";
declare global {
    interface Window {
        imageArray: any[];
    }
};
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
export type ImageType = "blur" | "brightness" | "contrast" | "grayscale" | "huerotate" | "invert" | "opacity" | "saturate" | "sepia" | "shadow";
export default function Filter(): JSX.Element {
    var [imageArray, setImageArray] = useState<any[]>([]);
    var [imageFileName, setImageFileName] = useState<string>("");
    var [imageFileExtension, setImageFileExtension] = useState<string>("");
    var [imageBase64, setImageBase64] = useState<string>("/libear-only.png");
    var [imageTypes, setImageTypes] = useState<ImageType[]>(ImageTypesGen);
    registerPlugin(FilePondPluginFileRename, FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageEdit, FilePondPluginImageCrop); // Register the plugin
    useEffect(function () {
        window.imageArray = imageArray;
    }, [imageArray]);
    return (
        <>
            <HeadBar isIndex={false} pageName={pages[6].name} />
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
                    };
                    reader.readAsDataURL(images[0].file);
                }}
                allowMultiple={true}
                maxFiles={1}
                name="files"
                labelIdle='拖拽图片到这里、粘贴或<span class="filepond--label-action">浏览</span>'
            />
            <FormGroup>
                {ImageTypesGen.map((item, index) => {
                    return (
                        <FormControlLabel control={<Checkbox defaultChecked onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const removeItem = () => {
                                setImageTypes(destroyer(imageTypes, item));
                            };
                            const addItem = () => {
                                setImageTypes([item, ...imageTypes]);
                            };
                            switch (event.target.checked) {
                                case true:
                                    addItem();
                                    break;
                                case false:
                                    removeItem();
                                    break;
                            };
                        }} />} key={item} label={item} />
                    );
                })}
            </FormGroup>
            <div id="images">
                {imageTypes.map((type) => <img title={type} key={type} className={imageStyle[type]} src={imageBase64} alt={type} />)}
            </div>
        </>
    );
};
