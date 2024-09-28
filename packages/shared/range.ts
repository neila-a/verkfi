export default function* range(top: number, initial = 0) {
    for (let number = initial; number <= top; number++) {
        yield number;
    }
}
