import {
	AppBar,
	Toolbar,
	IconButton,
	Typography
} from "@mui/material";
import {
	ArrowBack
} from "@mui/icons-material"
import Router from "next/router";
/**
 * AppBar 的自定义封装。
 * @param {boolean} isIndex 是否是索引页面
 * @param {string} pageName 页面的名称
 */
function HeadBar(props): JSX.Element {
	return (
		<AppBar position="static">
			<Toolbar>{props.isIndex ? <></> :
				<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => {
					Router.push("/");
				}}>
					<ArrowBack />
				</IconButton>}
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{
					textAlign: "center"
				}}>
					{props.isIndex ? "NeilaTools" : props.pageName}
				</Typography>
			</Toolbar>
		</AppBar>
	);
}
export default HeadBar;