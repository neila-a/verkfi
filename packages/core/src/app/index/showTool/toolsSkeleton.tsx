import {
    mostUsedSelects
} from "@verkfi/shared/atoms";
import ToolsStack from "./ToolsStack";
import SkeletonTools from "./SkeletonTools";
export const emptyArray = Array(mostUsedSelects);
const ToolsSkeleton = () => <ToolsStack paramTool={emptyArray} notfound ListContainer={SkeletonTools} GridContainer={SkeletonTools} />;
export default ToolsSkeleton;
