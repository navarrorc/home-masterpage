export var mySUT = {
  callCallback(cb) {
    cb();
  },
  
  callBackWithReturnValue(cb) {
    return cb();
  },
  
  // callDependency(){
  //   return myDep.someMethod();
  // },
  
  callDependencyBetter: function(dep){
    return dep.someMethod();
  }
} 

export var myDep = {
  someMethod() {
    return 10;
  }
}


export function realCallback() {
  return 4;
}