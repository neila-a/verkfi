import {
    Ubuntu as NextUbuntu
} from "next/font/google";
const Ubuntu = NextUbuntu({
    weight: ["300", "400", "500", "700"],
    subsets: ["cyrillic", "cyrillic-ext", "greek", "greek-ext", "latin", "latin-ext"]
});
export default Ubuntu;
