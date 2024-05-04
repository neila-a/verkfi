import {
    MetadataRoute
} from "next";
import pack from "../../package.json";
import pages from "./pages.json";
export default function sitemap(): MetadataRoute.Sitemap {
    let url = new URL(pack.homepage);
    try {
        url = new URL(process.env.VERKFI_URL);
    } catch (reason) {
        console.error(`URL build failed, reason: ${reason}. Using ${url} from homepage in package.json.`);
    }
    return pages.map(page => ({
        url: new URL(url + page).toString()
    }));
}
