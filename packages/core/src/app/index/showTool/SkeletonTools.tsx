import {
    Skeleton
} from "@mui/material";
import SingleTool from "./SingleTool";
import {
    emptyArray
} from "./toolsSkeleton";
/**
 * @internal
 */
const SkeletonTools = () => emptyArray.fill(0).map((item, index) => <Skeleton key={index} sx={{
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
</Skeleton>);
export default SkeletonTools;
