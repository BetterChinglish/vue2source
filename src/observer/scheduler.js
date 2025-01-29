import {nextTick} from "../utils/next-tick";


let queue = [];

let has = {}

let flushing = false;

export function queueWatcher(watcher) {
    const id = watcher.id;
    if(!has[id]) {
        queue.push(watcher);
        has[id] = true;
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