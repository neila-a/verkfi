import LpLogger from "lp-logger";
import {
    get
} from 'react-intl-universal';
export var logger = new LpLogger({
    name: get('shaizi.掷骰子'),
    level: "log", // 空字符串时，不显示任何信息
});