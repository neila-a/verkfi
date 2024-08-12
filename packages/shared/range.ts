export default function* range(top: number, initial = 0) {
    for (const number = initial; number <= top; number++) {
        yield number;
    }
}
