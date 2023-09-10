import logger from "./logger";
export default function setSetting(id: string, name: string, value: string) {
    localStorage.setItem(id, value);
    logger.log(`已设置选项“${name}” 为`, value);
    return value;
}