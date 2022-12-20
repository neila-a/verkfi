import * as React from "react";
import {
    useState,
    useEffect
} from "react";
import Dropzone from "dropzone";
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
        <img title={props.type} key={props.type} className={imageStyle[props.type]} src={props.src}></img>
    );
};
export default function Filter(): JSX.Element {
    var [image, setImage] = useState<string>();
    useEffect(function () {
        let dropzone = new Dropzone("#UploadContainer");
        dropzone.on("addedfile", file => {
            console.log(`File added: ${JSON.stringify(file)}`);
        });
    });
    return (
        <>
            <HeadBar isIndex={false} pageName={pages[6].name} />
            <div id="images">
                {ImageTypes.map(function (type) {
                    return (
                        <div key={type}>
                            <Image type={type} src={image} />
                        </div>
                    );
                })}
            </div>
            <div id="UploadContainer"></div>
        </>
    );
};
