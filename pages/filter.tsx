import * as React from "react";
import {
    useState,
    useEffect
} from "react";
import {
    FilePond,
    registerPlugin
} from 'react-filepond'; // Import React FilePond
import {
    FilePondFile
} from "filepond";
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import HeadBar from "../components/HeadBar";
import {
    pages
} from "./index";
import imageStyle from "../styles/Filter.module.scss";
declare global {
    interface Window {
        image: any[];
        setImage: React.Dispatch<React.SetStateAction<any[]>>;
    }
};
export const ImageTypes: ImageType[] = [
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
export function Image(props: {
    type: ImageType;
    src: string;
}): JSX.Element {
    return (
        <img title={props.type} key={props.type} className={imageStyle[props.type]} src={props.src} alt={props.type}></img>
    );
};
export default function Filter(): JSX.Element {
    var [imageArray, setImageArray] = useState<any[]>([]);
    var [imageBase64, setImageBase64] = useState<string>("/libear-only.png");
    useEffect(function () {
        window.image = imageArray;
    }, [imageArray]);
    return (
        <>
            <HeadBar isIndex={false} pageName={pages[6].name} />
            <FilePond
                files={imageArray}
                onupdatefiles={(images: FilePondFile[]) => {
                    setImageArray(images);
                    useEffect(function () {
                        var reader = new FileReader();
                        reader.onload = function () {
                            setImageBase64(String(reader.result));
                        };
                        reader.readAsDataURL(images[0].file);
                    }, [setImageBase64]);
                }}
                allowMultiple={true}
                maxFiles={1}
                name="files"
                labelIdle='拖拽文件到这里、粘贴或<span class="filepond--label-action">浏览</span>'
            />
            <div id="images">
                {ImageTypes.map((type) => (
                    <div key={type}>
                        <Image type={type} src={imageBase64} />
                    </div>
                ))}
            </div>
        </>
    );
};
