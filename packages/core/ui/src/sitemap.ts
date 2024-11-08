import pages from "./pages.json";
import getHomePage from "layout/getHomepage";
export default function sitemap() {
    const url = getHomePage();
    return pages.map(page => ({
        url: new URL(url + page).toString()
    }));
}
