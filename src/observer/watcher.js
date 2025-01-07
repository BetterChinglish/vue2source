import { pushTarget, popTarget } from './dep'



let id = 0;

class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this._vm = vm;
    this._callback = callback;
    this._options = options;
    this.id = id++;
    this.getter = exprOrFn;
    
    this.get();
  }
  get() {
    pushTarget(this)
    this.getter();
    popTarget();
  }
  update() {
    this.get();
  }
}

export default Watcher;

