import pack from "../../package.json";
export async function getRepoInfo() {
    const repoInfo: {
        name: string;
        description: string;
    } = await (await fetch(`https://api.github.com/repos/${pack.repository.replace("github:", "")}`)).json();
    return repoInfo;
}
