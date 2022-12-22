import * as React from "react";
import {
    useState,
    useEffect
} from "react";
import { FilePond, registerPlugin } from 'react-filepond'; // Import React FilePond
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import HeadBar from "../components/HeadBar";
import {
    pages
} from "./index";
import imageStyle from "../styles/Filter.module.scss";
declare global {
    interface Window {
        image: any[];
        setImage: React.Dispatch<React.SetStateAction<any[]>>
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
    var [image, setImage] = useState<any[]>([]);
    
    useEffect(function () {
        window.image = image;
        window.setImage = setImage;
    }, [image, setImage]);
    return (
        <>
            <HeadBar isIndex={false} pageName={pages[6].name} />
            <FilePond
                files={image}
                onupdatefiles={setImage}
                allowMultiple={true}
                maxFiles={1}
                server="/api"
                name="files"
                labelIdle='拖拽文件到这里、粘贴或<span class="filepond--label-action">浏览</span>'
            />
            <div id="images">
                {ImageTypes.map((type) => (
                    <div key={type}>
                        <Image type={type} src={/* Test Deleted image[0] */"/libear-only.png"} />
                    </div>
                ))}
            </div>
        </>
    );
};
