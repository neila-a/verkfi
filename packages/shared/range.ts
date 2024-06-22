export default function* range(top: number, initial: number = 0) {
    for (let number = initial; number <= top; number++) {
        yield number;
    }
}
