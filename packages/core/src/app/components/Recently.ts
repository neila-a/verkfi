export default class Recently extends Set<string> {
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
        old: Iterable<string>
    ) {
        super(old);
        this.max = max;
    }
    get() {
        return [...super.entries()].map(item => item[1]);
    }
    override add(name: string) {
        super.add(name);
        if (this.get()[super.size - 1] !== name) {
            super.delete(name);
            super.add(name);
        }
        if (super.size > this.max) {
            this.get().forEach((item, index) => {
                if (index === 0) {
                    super.delete(item);
                }
            });
            super.delete(this.get()[0]);
        }
        return this;
    }
}
