import {
    Download as DownloadIcon
} from "@mui/icons-material";
import {
    IconButton,
    ImageListItem,
    ImageListItemBar,
    Box
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import domtoimage from "dom-to-image";
import saveAs from "file-saver";
import {
    get
} from "react-intl-universal";
import {
    ImageType
} from "./consts";
import filters from "./filters";
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
                // 100用于将百分比转换为整数
                // eslint-disable-next-line no-magic-numbers
                transform: `scale(${(Number(props.scale) / 100).toString()})`,
                filter: filters[type]
            }} />
            <Box component="figcaption">
                <ImageListItemBar title={type} subtitle={props.imageFileName} actionIcon={(
                    <MouseOverPopover text={get("filter.save")}>
                        <IconButton onClick={async event => {
                            const blob = await domtoimage.toBlob(document.getElementById(type));
                            // 调用file-save方法 直接保存图片
                            saveAs(blob, `${props.imageFileName}.${type}.png`);
                        }} aria-label={get("filter.save")}>
                            <DownloadIcon />
                        </IconButton>
                    </MouseOverPopover>
                )} />
            </Box>
        </ImageListItem>
    );
}
