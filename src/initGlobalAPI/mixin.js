import {mergeOptions} from "../utils";

export default function (Vue) {
    Vue.mixin = function (mixin) {
        // 混入的时候将属性合并到options上
        this.options = mergeOptions(this.options, mixin);
    }
}