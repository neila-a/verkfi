import pack from "./package.json";
export interface repoInfo {
    name: string;
    description: string;
}
const getRepoInfo = () => fetch(`https://api.github.com/repos/${pack.repository.replace("github:", "")}`).then(response => response.json()).then(json => json as repoInfo);
export default getRepoInfo;
