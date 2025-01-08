import { pushTarget, popTarget } from './dep'

let id = 0;

class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this._vm = vm;
    this._callback = callback;
    this._options = options;
    this.id = id++;
    this.getter = exprOrFn;
    this.depsId = new Set();
    this.deps = [];
    this.get();
  }
  // watcher里不放重复的dep，dep不放重复的watcher
  addDep(dep) {
    let id = dep.id;
    if(!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(id);
      dep.addSub(this);
    }
  }
  get() {
    pushTarget(this)
    this.getter();
    popTarget();
  }
  update() {
    queueWatcher(this);
  }
  run() {
    this.get()
  }
}

let queue = [];
let has = {}
let timer = false;
function queueWatcher(watcher) {
  const id = watcher.id;
  if(!has[id]) {
    queue.push(watcher);
    has[id] = true;
    if(!timer) {
      timer = true;
      setTimeout(() => {
        queue.forEach(watcher => watcher.run())
        queue = [];
        has = {};
        timer = false;
      }, 0)
    }
  }
}


export default Watcher;

