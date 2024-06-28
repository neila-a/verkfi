import {
    mostUsedSelects
} from "@verkfi/shared/atoms";
import ToolsStack from "./ToolsStack";
import SingleToolSkeleton from "./SingleToolSkeleton";
export const emptyArray = Array(mostUsedSelects);
const Skeletons = () => emptyArray.fill(0).map((item, index) => <SingleToolSkeleton key={index} />),
    ToolsSkeleton = () => <ToolsStack paramTool={emptyArray} notfound ListContainer={Skeletons} GridContainer={Skeletons} />;
export default ToolsSkeleton;
