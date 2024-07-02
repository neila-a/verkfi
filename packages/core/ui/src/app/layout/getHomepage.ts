import pack from "../../../package.json";
export default function getHomePage() {
    let url = new URL(pack.homepage);
    try {
        url = new URL(process.env.VERKFI_URL);
    } catch (reason) {
        console.error(`URL build failed, reason: ${reason}. Using ${url} from homepage in package.json.`);
    }
    return url;
}
