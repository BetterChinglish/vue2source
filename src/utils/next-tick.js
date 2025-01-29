

let callbacks = [];
let waiting = false;

export function nextTick(cb) {
    callbacks.push(cb);

    // 避免重复调用nextTick
    if(!waiting) {
        setTimeout(flushCallbacks, 0);
        waiting = true;
    }
}

function flushCallbacks() {
    callbacks.forEach(cb => cb());
    callbacks = [];
    waiting = false;
}