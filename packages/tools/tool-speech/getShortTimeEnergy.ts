import chunkArray from "array-chunkify";
const chunkSize = 256;
export default function getShortTimeEnergy(audioData: Float32Array) {
    const splited: number[][] = chunkArray([...audioData], chunkSize),
        sumed = splited.map(one => one.reduce((prev, next) => prev + next));
    return sumed;
}
