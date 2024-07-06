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
// eslint-disable-next-line import/no-anonymous-default-export
export default [...ImageTypesGen] as ImageType[];
