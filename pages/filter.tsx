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
    });
    return (
        <>
            <HeadBar isIndex={false} pageName={pages[6].name} />
            <div id="images">
                {ImageTypes.map(function (type) {
                    return (
                        <div key={type}>
                            <Image type={type} src={image[0]} />
                        </div>
                    );
                })}
            </div>
            <FilePond
                files={image}
                onupdatefiles={setImage}
                allowMultiple={true}
                maxFiles={1}
                server="/api"
                name="files" /* sets the file input name, it's filepond by default */
                labelIdle='拖拽文件到这里、粘贴或<span class="filepond--label-action">浏览</span>'
            />
        </>
    );
};
