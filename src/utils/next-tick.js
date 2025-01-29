

let callbacks = [];
let waiting = false;
export function nextTick(cb) {
    callbacks.push(cb);

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