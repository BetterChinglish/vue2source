

class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this._vm = vm;
    this._callback = callback;
    this._options = options;
    
    this.getter = exprOrFn;
    
    this.get();
  }
  get() {
    this.getter();
  }
}

export default Watcher;

