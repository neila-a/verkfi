export default function* range(top: number, initial: number = 0) {
    for (let i = initial; i <= top; i++) {
        yield i;
    }
}
