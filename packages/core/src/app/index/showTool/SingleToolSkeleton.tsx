import {
    Skeleton
} from "@mui/material";
import SingleTool from "./SingleTool";
const SingleToolSkeleton = () => <Skeleton sx={{
    transform: "unset",
    maxWidth: "unset"
}}>
    <SingleTool focus={false} disableClick tool={{
        name: "E",
        // @ts-ignore 占空值
        icon: () => 1,
        to: "e",
        desc: "E",
        // @ts-ignore 占空值
        color: ["114514", "191981"]
    }} />
</Skeleton>;
export default SingleToolSkeleton;
