/**
 * 节流  
 * 在事件被触发后，在规定时间内无论在怎么触发只会调用一次函数，直到时间结束
 * @param {Function} func 要执行的函数
 * @param {number} delay 时间
 * @return {Function} 
 */
export default function throttle(func: Function, delay: number): (...args) => void {
    let timer = null;
    return function (...args) {
        // let args=arguments 也可以写成这种或...args也是代表我们传过来的实参
        if (!timer) {
            timer = setTimeout(() => {
                func.apply(this, args);
                timer = null;
            }, delay)
        }
        // 当我们第一次触发事件，定时器不存在时就执行函数，当我们再次点击时，因为定时器存在，
        // 所以无法再进入函数调用(无论事件如何执行),那么只能等定时器事件结束，
        // 我们让timer=null，回到第一次的状态,就又重新开始新的一轮
    }
}