import actions = require('../actions');

export var API = {
  fetchChirps: ()=> {
    //console.info(actions['gotChirps'].toString());
    get(_spPageContextInfo.webAbsoluteUrl + "/_api/Web/CurrentUser?$select=Email")
      .then(actions['gotChirps'].bind(actions));
  },
  startFetchingChirps: function () {
    this.fetchChirps();
    return setInterval(this.fetchChirps, 1000);
  },
  // SP Groups for current logged in user
  // fetchGroups: ()=> {
  //     get(_spPageContextInfo.webAbsoluteUrl + "")
  // }
};

function get(url:string) {
  var deferred = $.Deferred();
  $.get(
    url,
    (data:any, status: string)=>{
      deferred.resolve(data);
    }, 'json').fail((sender, args)=>{
      deferred.reject(sender, args);
      console.info('Error: ' + args.get_message());
    });
  return deferred.promise().then((data:any)=>{
    return data;
  });
}
