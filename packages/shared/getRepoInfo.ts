import pack from "./package.json";
export interface repoInfo {
    name: string;
    description: string;
}
const getRepoInfo = async () => {
    let fetched = {
    } as repoInfo;
    try {
        const response = await fetch(`https://api.github.com/repos/${pack.repository.replace("github:", "")}`);
        fetched = await response.json();
    } catch {
    }
    return {
        name: fetched?.name || "Verkfi",
        description: fetched?.description || "failed to get description"
    } as repoInfo;
};
export default getRepoInfo;
