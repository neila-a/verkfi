import LpLogger from "lp-logger";
import I18N from 'react-intl-universal';
export var logger = new LpLogger({
    name: I18N.get('掷骰子'),
    level: "log", // 空字符串时，不显示任何信息
});