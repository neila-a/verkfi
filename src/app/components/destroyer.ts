
/**
 * 从数组里删除项目
 * @param T 类型参数，用来删除的数组中的类型
 * @param T[] 用来删除的数组
 * @param T 要删除的项目值
 * @returns 删除完毕的数组
 */
export default function destroyer<T = any>(array: T[], ...arg: T[]): T[] {
    // 获取目标数组
    var newArray: T[] = array; // [1, 2, 1, 3, 2, 1, 3, 4, 2, 6]
    // 声明一个空数组，用来存储需要从`newArray`中删除的元素
    var removeArgs: T[] = [];
    for (let i: number = 0, len = arg.length; i < len; i++) {
        removeArgs.push(arg[i]);
        /*
         *  遍历次数  i  len   i < len  i++  arguments[i]  removeArgs
         *  1st     1    3     yes      2     1            [1]
         *  2nd     2    3     yes      3     2            [1,2]
         *  3rd     3    3     no
         *  end loop
         *  
         */
    }
    // 声明filter()方法的callback函数
    function isFalse(value): boolean {
        return removeArgs.indexOf(value) === -1;
        /*
         *  removeArgs = [1,2]
         *  removeArgs.indexOf(value) = ?  removeArgs.indexOf(value) === -1
         *  [1,2].indexOf(1) = 0              false
         *  [1,2].indexOf(2) = 1              false
         *
         */
    }
    return newArray.filter(isFalse);// newArray中删除1,2
}