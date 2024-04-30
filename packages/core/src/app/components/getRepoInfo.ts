import pack from "../../../package.json";
export interface repoInfo {
    name: string;
    description: string;
};
export async function getRepoInfo() {
    const repoInfo: repoInfo = await (await fetch(`https://api.github.com/repos/${pack.repository.replace("github:", "")}`)).json();
    return repoInfo;
}
