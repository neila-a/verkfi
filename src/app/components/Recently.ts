export default class Recently {
    /**
     * 创建时指定的最大个数
     */
    max = 0;
    private set: Set<string>;
    constructor(
        /**
         * 最大个数
         */
        max: number,

        /**
         * 之前的最近
         */
        old: Iterable<string>
    ) {
        this.max = max;
        this.set = new Set<string>(old);
    };
    get() {
        return [...this.set.entries()].map(item => item[1]);
    }
    add(name: string) {
        this.set.add(name);
        if (this.get()[this.set.size - 1] !== name) {
            this.set.delete(name);
            this.set.add(name);
        }
        if (this.set.size > this.max) {
            this.get().forEach((item, index) => {
                if (index === 0) {
                    this.set.delete(item);
                }
            })
            this.set.delete(this.get()[0]);
        }
    }
}