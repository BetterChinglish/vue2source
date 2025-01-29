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
  // dep通知watcher更新时，会调用update方法
  update() {
    console.log('update');
    // 重复watcher只放一次执行一次，避免多次相同watcher的render方法重复执行
    queueWatcher(this);
  }
  run() {
    this.get()
  }
}




export default Watcher;

