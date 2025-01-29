import { pushTarget, popTarget } from './dep';
import { queueWatcher } from './scheduler';


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
    console.log('update');
    queueWatcher(this);
  }
  run() {
    this.get()
  }
}




export default Watcher;

