import range from "@verkfi/shared/range";

export default function getShortTimeEnergy(audioData: Float32Array) {
    let sum = 0;
    const {
        length
    } = audioData;
    return [...range(length - 1)].map(i => {
        sum += audioData[i] ** 2;
        if ((i + 1) % 256 === 0) {
            const ret = sum;
            sum = 0;
            return ret;
        } else if (i === length - 1) {
            return sum;
        }
    });
}
