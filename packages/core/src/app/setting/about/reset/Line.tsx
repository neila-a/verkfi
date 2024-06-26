import {
    Box,
    LinearProgress,
    Stack,
    Typography
} from "@mui/material";
/**
 * 线段图
 * @param value 百分比
 * @param usedLabel 百分比的标签
 * @param surLabel 剩余百分比的标签
 * @param mainLabel 主标签
 * @returns 一个React元素，其中含有线段图
 */
export default function Line(props: {
    value: number;
    usedLabel: string;
    surLabel: string;
    mainLabel: string;
}) {
    return (
        <Stack direction="column" spacing={1}>
            <Typography>
                {props.mainLabel}
            </Typography>
            <Box sx={{
                width: "100%",
                mr: 1
            }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Box sx={{
                    minWidth: 35
                }}>
                    <Typography variant="body2" color="text.secondary">
                        {props.usedLabel}
                    </Typography>
                </Box>
                <Box sx={{
                    minWidth: 35
                }}>
                    <Typography variant="body2" color="text.secondary">
                        {props.surLabel}
                    </Typography>
                </Box>
            </Box>
        </Stack>
    );
}
