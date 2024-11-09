export type ImageType = typeof ImageTypesGen[number];
const ImageTypesGen = [
    "blur",
    "brightness",
    "contrast",
    "grayscale",
    "huerotate",
    "invert",
    "opacity",
    "saturate",
    "sepia",
    "shadow"
] as const;
export default ImageTypesGen.slice(0) as ImageType[];
