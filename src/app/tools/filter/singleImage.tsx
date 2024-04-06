import {
    ImageListItem,
    ImageListItemBar,
    IconButton
} from "@mui/material";
import domtoimage from 'dom-to-image';
import {
    Box
} from "@mui/system";
import saveAs from "file-saver";
import {
    Download as DownloadIcon
} from "@mui/icons-material";
import filters from "./filters";
import {
    ImageType
} from "./consts";
import MouseOverPopover from "components/Popover";
import {
    get
} from "react-intl-universal";
export default function SingleImage(props: {
    type: ImageType;
    imageURL: string;
    imageFileName: string;
    scale: number;
}) {
    const {
        type
    } = props;
    return (
        <ImageListItem key={type} component="figure">
            <img title={type} key={type} src={props.imageURL} id={type} alt={type} style={{
                transform: `scale(${(Number(props.scale) / 100).toString()})`,
                filter: filters[type]
            }} />
            <Box component="figcaption">
                <ImageListItemBar title={type} subtitle={props.imageFileName} actionIcon={(
                   <MouseOverPopover text={get("filter.save")}>
                        <IconButton onClick={async event => {
                            const blob = await domtoimage.toBlob(document.getElementById(type));
                            // 调用file-save方法 直接保存图片
                            saveAs(blob, `${props.imageFileName}.${type}.png`)
                        }} aria-label={get("filter.save")}>
                            <DownloadIcon />
                        </IconButton>
                   </MouseOverPopover>
                )} />
            </Box>
        </ImageListItem>
    );
}