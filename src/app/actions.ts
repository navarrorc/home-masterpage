import {dispatcher} from './Dispatcher';
import {constants} from './Constants';

Object.keys(constants).forEach((key:string) => {
    var funcName = key.split('_').map((word:string, i:number)=>{
      if(i === 0) return word.toLowerCase();
      return word[0] + word.slice(1).toLowerCase();
    }).join('');

    //console.info(funcName);

    // TODO: try to find a fix for this,
    // error is, "Error TS7017: Index signature of object type implicitly has an \'any\' type."
    exports[funcName] = (data:any) => {
      dispatcher.dispatch(<any>{
        actionType: constants[key],
        data:data
      });
    };
});
/*
export var chirp = (data) => {
  dispatcher.dispatch({
    actionType: constants.CHIRP,
    data: data
  });
}*/
