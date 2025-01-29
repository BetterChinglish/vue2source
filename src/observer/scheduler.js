import {nextTick} from "../utils/next-tick";


let queue = [];

let has = {}

let flushing = false;

export function queueWatcher(watcher) {
    const id = watcher.id;
    // 避免重复watcher
    if(!has[id]) {
        queue.push(watcher);
        has[id] = true;
        // 通过nextTick来执行watcher的run方法，避免重复调用nextTick
        if (!flushing) {
            flushing = true;
            nextTick(flushSchedulerQueue);
        }
    }
}

function flushSchedulerQueue() {
    queue.forEach(watcher => watcher.run())
    queue = [];
    has = {};
    flushing = false;
}