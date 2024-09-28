import pack from "./package.json";
export interface repoInfo {
    name: string;
    description: string;
}
const getRepoInfo = async () => {
    try {
        const fetched = await fetch(`https://api.github.com/repos/${pack.repository.replace("github:", "")}`);
        return (await fetched.json()) as repoInfo;
    } catch {
        return {
            name: "Verkfi",
            description: "failed"
        } as repoInfo;
    }
};
export default getRepoInfo;
