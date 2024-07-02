/**
 * 其实就是一个栈
 */
export default class Recently<T> extends Set<T> {
    /**
     * 创建时指定的最大个数
     */
    max = 0;
    constructor(
        /**
         * 最大个数
         */
        max: number,

        /**
         * 之前的最近
         */
        old: Iterable<T>
    ) {
        super(old);
        this.max = max;
    }
    get() {
        return [...super.entries()].map(item => item[1]);
    }
    override add(name: T) {
        super.add(name);
        if (this.get()[super.size - 1] !== name) {
            super.delete(name);
            super.add(name);
        }
        if (super.size > this.max) {
            super.delete(this.get()[0]);
        }
        return this;
    }
}
