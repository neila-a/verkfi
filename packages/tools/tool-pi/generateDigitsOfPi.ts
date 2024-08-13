/* eslint-disable no-magic-numbers */
// 整段代码都不知道什么意思
export default function* generateDigitsOfPi() {
    let q = 1n,
        r = 180n,
        t = 60n,
        i = 2n;
    while (true) {
        let digit = ((i * 27n - 12n) * q + r * 5n) / (t * 5n);
        // 无法用一元加转换bigint
        yield Number(digit);
        let u = i * 3n;
        u = (u + 1n) * 3n * (u + 2n);
        r = u * 10n * (q * (i * 5n - 2n) + r - t * digit);
        q *= 10n * i * (i++ * 2n - 1n);
        t *= u;
    }
}
